/** Whether an example's follow-up copy is only Markdown quotes, which makes it a note. */
function isNote(copy: string): boolean {
  return copy
    .trim()
    .split('\n')
    .every(
      /** Accept quote lines and the blank lines between them. */
      (line) => line.trim() === '' || line.trimStart().startsWith('>'),
    );
}

/**
 * Split an example's follow-up copy by where it belongs. A note sits above the example, under
 * the description; any other copy explains the example and stays after it.
 */
export function placeStoryCopy(copy: string | undefined): {
  readonly note: string | undefined;
  readonly after: string | undefined;
} {
  if (!copy) return { note: undefined, after: undefined };
  return isNote(copy) ? { note: copy, after: undefined } : { note: undefined, after: copy };
}
