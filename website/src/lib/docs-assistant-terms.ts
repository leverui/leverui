/**
 * How the docs assistant reads words: which ones carry meaning, which everyday words map to
 * the docs' own names, and which ones speak to the assistant itself.
 */

const stopWords = new Set(
  (
    'a about all also am an and another any anything are as at be been but by can component ' +
    'components could did do does doing else find for from get give go got had has have help how ' +
    'i if in into is it its just know let lever like look make many me more much my need no not of ok other ' +
    'okay on or please pls plz put re really thats theres whats hows wheres im ive id lets see should show so some something take tell than that ' +
    'the then there these thing things wat this those to too try ui use using very want was way ' +
    'we were what when where which who whom whose why will with work works would yes you ' +
    'your yours'
  ).split(' '),
);

/** Words that speak to the assistant, rather than ask about Lever UI. */
const assistantWords = new Set('you your yours yourself youre youve u ur'.split(' '));
/** Words that ask what the assistant is. */
const natureWords = new Set('ai bot chatbot robot assistant human person'.split(' '));

/**
 * Everyday words, and the words the docs use instead. The docs' words replace the everyday
 * one, so "accessible" finds the Accessibility guide rather than every page that says it.
 */
const synonyms: Readonly<Record<string, readonly string[]>> = {
  modal: ['dialog'],
  popup: ['popover', 'dialog'],
  dropdown: ['menu', 'select'],
  dark: ['color', 'mode'],
  light: ['color', 'mode'],
  notification: ['toast'],
  calendar: ['date', 'picker', 'calendar'],
  graph: ['chart'],
  ssr: ['server', 'rendering'],
  hydration: ['server', 'rendering'],
  accessible: ['accessibility'],
  a11y: ['accessibility'],
  keyboard: ['accessibility'],
  install: ['installation'],
  setup: ['installation'],
  start: ['installation'],
  css: ['customize', 'css'],
  style: ['customize', 'css'],
  styling: ['customize', 'css'],
  colour: ['color'],
  toggle: ['switch'],
  upload: ['file', 'upload'],
  autocomplete: ['combobox'],
  form: ['field', 'form'],
  validation: ['invalid', 'error'],
  rounded: ['radius', 'rounded'],
  corner: ['radius'],
  corners: ['radius'],
  loading: ['skeleton', 'spinner', 'loading'],
  loader: ['spinner', 'skeleton'],
  hint: ['tooltip', 'hint'],
  shortcut: ['kbd', 'shortcut'],
  shortcuts: ['kbd', 'shortcut'],
  hotkey: ['kbd'],
  kb: ['format', 'byte'],
  mb: ['format', 'byte'],
  gb: ['format', 'byte'],
  bytes: ['format', 'byte'],
  rtl: ['rtl', 'direction', 'locale'],
  currency: ['format', 'number', 'currency'],
  mobile: ['responsive', 'mobile'],
  phone: ['responsive'],
  tablet: ['responsive'],
  search: ['combobox', 'command', 'search'],
  suggestions: ['combobox'],
  typeahead: ['combobox'],
  wizard: ['steps'],
  stepper: ['steps'],
  theming: ['customize', 'css', 'theme'],
  themes: ['theme', 'scoped', 'customize'],
};

/** Phrases that stand for one docs word, read before the question is split into words. */
const phrases: readonly (readonly [RegExp, string])[] = [
  [/\bright[\s-]+to[\s-]+left\b/g, 'rtl'],
  [/\bfile\s+size\b/g, 'bytes'],
];

/**
 * Words for what the docs are about, beyond the page titles. One of these makes a question
 * about Lever UI, as a page title does.
 */
const topicWords = new Set(
  (
    'aria breakpoint breakpoints i18n icon icons javascript js jsx locale npm package pnpm ' +
    'prop props render rendering responsive rtl solid solidjs theme ' +
    'theming token tokens ts tsx typescript variable variables vite'
  ).split(' '),
);

/** Lowercase a word and drop filler words, for both the index and the question. */
export function indexTerm(term: string): string | null {
  const word = term.toLowerCase();
  return stopWords.has(word) || word.length < 2 ? null : word;
}

/** Swap an everyday word in the question for the docs' own words. */
export function questionTerms(term: string): string | string[] | null {
  const word = indexTerm(term);
  if (!word) return null;
  const replacement = synonyms[word];
  return replacement ? [...replacement] : word;
}

/** The docs' words for one word of the question. */
export function docsWordsFor(word: string): readonly string[] {
  return synonyms[word] ?? [word];
}

/** Every topic word and every everyday word the assistant knows, for spelling correction. */
export function knownTopicWords(): readonly string[] {
  return [...topicWords, ...Object.keys(synonyms)];
}

/** Report whether a word is about Lever UI: a topic word, or an everyday word for one. */
export function isDocsTopic(word: string): boolean {
  return word in synonyms || topicWords.has(word);
}

/**
 * Let a word match the start of longer words ("chart" finds "charts") only when it is long
 * enough to mean something on its own: "form" should not find "format".
 */
export function matchesWordStart(term: string): boolean {
  return term.length >= 5;
}

/** Allow a typo in a longer word, and two (such as swapped letters) in a long one. */
export function typoAllowance(term: string): number {
  if (term.length >= 6) return 2;
  return term.length >= 4 ? 1 : 0;
}

/** The parts of a question the assistant decides on. */
export interface QuestionWords {
  /** The words that carry meaning, with filler words removed. */
  readonly words: readonly string[];
  /** Whether the question speaks to the assistant, such as "are you" or "your". */
  readonly toAssistant: boolean;
  /** Whether the question asks what the assistant is, such as "is this a bot". */
  readonly aboutAssistant: boolean;
  /** Every word of the question, lowercase, including filler words. */
  readonly tokens: readonly string[];
  /** Whether the question has any letters or digits, rather than only an emoji or "?". */
  readonly hasText: boolean;
}

/** Split a question into its meaningful words, and notice when it speaks to the assistant. */
export function readQuestion(question: string): QuestionWords {
  let text = question.toLowerCase().replace(/['’]/g, '');
  for (const [phrase, word] of phrases) text = text.replace(phrase, word);
  const tokens = text.split(/[^a-z0-9]+/).filter(Boolean);
  return {
    words: tokens.filter(
      /** Keep the words that carry meaning. */
      // A number alone, such as "12", says nothing about what was asked.
      (token) =>
        indexTerm(token) !== null &&
        !/^\d+$/.test(token) &&
        !assistantWords.has(token) &&
        !natureWords.has(token),
    ),
    toAssistant: tokens.some(
      /** Find a word that speaks to the assistant. */
      (token) => assistantWords.has(token) || natureWords.has(token),
    ),
    aboutAssistant: tokens.some(
      /** Find a word that asks what the assistant is. */
      (token) => natureWords.has(token),
    ),
    tokens,
    hasText: tokens.length > 0,
  };
}
