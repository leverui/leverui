/** The docs assistant's index over the guides, with what it needs to know about their titles. */
import MiniSearch from 'minisearch';
import { indexTerm, matchesWordStart, questionTerms, typoAllowance } from './docs-assistant-terms';
import { titleWordsOf } from './docs-assistant-titles';
import type { Guide } from './docs';

/** One page's title, as words, with its address. */
interface PageTitle {
  readonly words: readonly string[];
  readonly path: string;
}

/** The guides' search index, with what the assistant needs to know about their titles. */
export interface DocsIndex {
  readonly search: MiniSearch<Guide>;
  /** Every title word, and every multi-word title run together, such as "datepicker". */
  readonly titleWords: readonly string[];
  /** Each run-together title, and the words it splits into. */
  readonly compounds: ReadonlyMap<string, readonly string[]>;
  /** Every page's title words and address. */
  readonly titles: readonly PageTitle[];
  /** Every word the docs use, so a real word is never mistaken for a typo. */
  readonly vocabulary: ReadonlySet<string>;
  /** How many component, chart, and hook pages there are. */
  readonly componentCount: number;
}

/** Split text into lowercase words. */
function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Build the search index over every guide. */
export function createDocsIndex(guides: readonly Guide[]): DocsIndex {
  const vocabulary = new Set(
    guides.flatMap(
      /** Collect the words one page uses. */
      (guide) => wordsOf(`${guide.title} ${guide.content}`),
    ),
  );
  const search = new MiniSearch<Guide>({
    idField: 'path',
    fields: ['title', 'summary', 'content'],
    storeFields: ['title', 'path', 'summary'],
    processTerm: indexTerm,
    searchOptions: {
      boost: { title: 6, summary: 2 },
      prefix: matchesWordStart,
      fuzzy:
        /** A word the docs use as written is not a typo, so it only matches itself. */
        (term) => (vocabulary.has(term) ? 0 : typoAllowance(term)),
      combineWith: 'OR',
      processTerm: questionTerms,
    },
  });
  search.addAll([...guides]);
  const titles = guides.map(
    /** Read one page's title words. */
    (guide) => ({ words: titleWordsOf(guide.title), path: guide.path }),
  );
  const compounds = new Map<string, readonly string[]>();
  for (const { words } of titles) if (words.length > 1) compounds.set(words.join(''), words);
  const componentCount = guides.filter(
    /** Count the component, chart, and hook pages. */
    (guide) => guide.kind === 'component',
  ).length;
  const titleWords = new Set([
    ...titles.flatMap(
      /** Collect one page's title words. */
      (title) => title.words,
    ),
    ...compounds.keys(),
  ]);
  return { search, titleWords: [...titleWords], compounds, titles, vocabulary, componentCount };
}
