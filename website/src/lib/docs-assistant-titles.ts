/** How a word of a question is matched to a word of a page title. */

/**
 * How many typos turn one word into another: a letter added, removed, or changed, or two
 * neighboring letters swapped (so "dailog" is one typo from "dialog", not two).
 */
function typoCount(first: string, second: string): number {
  const table = Array.from({ length: first.length + 1 }, (_, row) =>
    Array.from({ length: second.length + 1 }, (_, column) => (row === 0 ? column : row)),
  );
  /** Read one cell of the table, treating cells outside it as far apart. */
  const cell = (row: number, column: number): number => table[row]?.[column] ?? Infinity;
  for (let row = 1; row <= first.length; row += 1) {
    for (let column = 1; column <= second.length; column += 1) {
      const change = first[row - 1] === second[column - 1] ? 0 : 1;
      let best = Math.min(
        cell(row - 1, column) + 1,
        cell(row, column - 1) + 1,
        cell(row - 1, column - 1) + change,
      );
      const swapped =
        first[row - 1] === second[column - 2] && first[row - 2] === second[column - 1];
      if (row > 1 && column > 1 && swapped) best = Math.min(best, cell(row - 2, column - 2) + 1);
      const target = table[row];
      if (target) target[column] = best;
    }
  }
  return cell(first.length, second.length);
}

/**
 * How many typos a question word may have and still mean a title word. Short words get
 * none, since a short near miss is usually a different word ("model" and "mode").
 */
function titleTypoAllowance(word: string): number {
  if (word.length >= 9) return 2;
  return word.length >= 6 ? 1 : 0;
}

/** Report whether one word is the plural of another, such as "tabs" of "tab". */
function isPluralOf(plural: string, singular: string): boolean {
  return plural === `${singular}s` || plural === `${singular}es`;
}

/** Endings dropped to find a word's stem, longest first. */
const endings = ['ition', 'ings', 'ing', 'ions', 'ion', 'ed', 'ive', 'es', 's', 'e'];

/**
 * A rough stem for a word, so that forms of it compare equal: "compose" and "composition"
 * both become "compos", and "hovering" becomes "hover". A doubled final letter is undone, as
 * in "formatting".
 */
export function stemOf(word: string): string {
  for (const ending of endings) {
    if (word.endsWith(ending) && word.length - ending.length >= 4) {
      const base = word.slice(0, -ending.length);
      return /([^ls])\1$/.test(base) ? base.slice(0, -1) : base;
    }
  }
  return word;
}

/** Stems shorter than this are too likely to be shared by unrelated words ("state", "stat"). */
const shortestComparableStem = 5;

/**
 * Report whether a question word means a word in a page title. Titles are short, so this is
 * stricter than the text search: the whole word, its plural ("tab" for "tabs"), a longer
 * word with a short ending ("test" for "testing"), another form of it ("compose" for
 * "composition"), or a typo in a long word. A short near miss, such as "car" for "card" or
 * "model" for "mode", does not count. Neither does a typo that changes the first letter
 * ("better" is not "letter") or a typo for a word the docs use as written. `shortTypos`
 * allows one typo inside a 4- or 5-letter word; leave it off when the target is an everyday
 * word, which is often one letter away from another real word ("model" and "modal").
 */
export function matchesTitleWord(
  word: string,
  titleWord: string,
  knownWord = false,
  shortTypos = true,
): boolean {
  if (word === titleWord) return true;
  // A plural matches its singular either way: "tab" finds "Tabs", "buttons" finds "Button".
  if (isPluralOf(titleWord, word) || isPluralOf(word, titleWord)) return true;
  // Longer words may also take a short ending, as "test" does in "testing".
  if (word.length >= 4 && titleWord.startsWith(word) && titleWord.length - word.length <= 3) {
    return true;
  }
  const stem = stemOf(word);
  if (stem.length >= shortestComparableStem && stem === stemOf(titleWord)) return true;
  // People rarely mistype the first letter, so a typo keeps it: "dailog" for "dialog".
  if (knownWord || word[0] !== titleWord[0]) return false;
  // A short word may have one typo inside it, but must keep its last letter too: "swich" is
  // "switch", while "model" is not "mode".
  const shortTypo = shortTypos && word.length >= 4 && word.at(-1) === titleWord.at(-1) ? 1 : 0;
  const allowance = Math.max(titleTypoAllowance(word), shortTypo);
  return allowance > 0 && typoCount(word, titleWord) <= allowance;
}

/** Split a page title into lowercase words. */
export function titleWordsOf(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}
