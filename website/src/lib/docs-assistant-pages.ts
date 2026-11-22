/**
 * How the docs assistant finds pages for a question: which pages the question names, whether
 * the page text covers it, and the best pages to link.
 */
import type { AnswerLink } from './docs-assistant';
import type { DocsIndex } from './docs-assistant-index';
import { toLink } from './docs-assistant-replies';
import { docsWordsFor, isDocsTopic, knownTopicWords } from './docs-assistant-terms';
import { matchesTitleWord } from './docs-assistant-titles';

/** How much of the question a page must account for, without a title or topic match. */
const minimumCoverage = 0.6;
/**
 * How many of the question's words a page must use, without a title or topic match. One
 * common word in a page's text, such as "time", says little about what was asked.
 */
const minimumMatchedWords = 2;
/** How many of the best pages the coverage check looks at. */
const coverageCandidates = 5;
/** The most pages one answer links. */
const linkLimit = 3;

/** Report whether a question word means a title word. */
function meansTitleWord(index: DocsIndex, word: string, titleWord: string): boolean {
  return matchesTitleWord(word, titleWord, index.vocabulary.has(word));
}

/**
 * Correct the spelling of words the docs never use, such as "themeing" or "seperator", to
 * the nearest word the assistant knows: a title word, a run-together title, a topic word,
 * or an everyday word. A word the docs use as written is left alone.
 */
export function correctSpelling(index: DocsIndex, words: readonly string[]): string[] {
  const topics = knownTopicWords();
  return words.map(
    /** Correct one word, or keep it. */
    (word) => {
      if (index.vocabulary.has(word) || isDocsTopic(word)) return word;
      const title = index.titleWords.find(
        /** Find a title word this one is a misspelling of. */
        (target) => matchesTitleWord(word, target),
      );
      const topic = topics.find(
        /** Find a topic word this one is a misspelling of, allowing only long-word typos. */
        (target) => matchesTitleWord(word, target, false, false),
      );
      return title ?? topic ?? word;
    },
  );
}

/** Report whether a word of the question names a page, or is an everyday word for one. */
export function namesAPage(index: DocsIndex, words: readonly string[]): boolean {
  return words.some(
    /** Check one word against the topic words and the title words. */
    (word) =>
      isDocsTopic(word) ||
      index.titleWords.some(
        /** Compare with one title word. */
        (titleWord) => meansTitleWord(index, word, titleWord),
      ),
  );
}

/**
 * Report whether one page's text answers most of the question, using at least two of its
 * words exactly. Typos and partial words do not count here, so a common word that only
 * resembles a docs term ("recipe" and "recipes") cannot make a question look covered.
 */
export function textCovers(index: DocsIndex, words: readonly string[]): boolean {
  const pages = index.search
    .search(words.join(' '), { fuzzy: 0, prefix: false })
    .slice(0, coverageCandidates);
  return pages.some(
    /** Check whether this page uses enough of the question. */
    (page) => {
      const used = words.filter(
        /** Count a word when the page uses it, or one of the docs' words for it. */
        (word) =>
          docsWordsFor(word).some(
            /** Check one of the docs' words. */
            (term) => page.queryTerms.includes(term),
          ),
      ).length;
      return used >= minimumMatchedWords && used / words.length >= minimumCoverage;
    },
  );
}

/**
 * Rewrite the question's words in the titles' own words, for searching: "datepicker" becomes
 * "date picker", and "compose" also searches "composition".
 */
function inTitleWords(index: DocsIndex, words: readonly string[]): string[] {
  return words.flatMap(
    /** Rewrite one word. */
    (word) => {
      for (const [compound, parts] of index.compounds) {
        if (meansTitleWord(index, word, compound)) return [...parts];
      }
      const titleWord = index.titleWords.find(
        /** Find the title word this word means. */
        (candidate) => meansTitleWord(index, word, candidate),
      );
      return titleWord && titleWord !== word ? [word, titleWord] : [word];
    },
  );
}

/**
 * The pages whose whole title the question names, such as both pages in "date picker and
 * select". Each one is linked, ahead of the search results.
 */
function namedPages(index: DocsIndex, words: readonly string[]): string[] {
  return index.titles
    .filter(
      /** Keep a page when every word of its title is in the question. */
      (title) =>
        title.words.every(
          /** Check one title word. */
          (titleWord) =>
            words.some(
              /** Check one question word. */
              (word) => meansTitleWord(index, word, titleWord),
            ),
        ),
    )
    .sort(
      /** Prefer longer titles, so "Date Picker" comes before "Date Input" for "date picker". */
      (first, second) => second.words.length - first.words.length,
    )
    .map(
      /** Read the page's address. */
      (title) => title.path,
    );
}

/** The best docs pages for some words: pages named by title first, then the best matches. */
export function bestPages(index: DocsIndex, words: readonly string[]): AnswerLink[] {
  const searchWords = inTitleWords(index, words);
  const results = index.search.search(searchWords.join(' '));
  const top = results[0];
  const matches = results
    .filter(
      /** Keep pages that score close to the best match. */
      (result) => top !== undefined && result.score >= top.score * 0.4,
    )
    .map(
      /** Read the page's address, which is the index's id for it. */
      (result) => String(result.id),
    );
  const paths = [...new Set([...namedPages(index, searchWords), ...matches])].slice(0, linkLimit);
  return paths
    .map(
      /** Read one page's stored title and summary. */
      (path) => index.search.getStoredFields(path),
    )
    .filter(
      /** Skip a page that is not in the index. */
      (fields): fields is Record<string, unknown> => Boolean(fields),
    )
    .map(toLink);
}
