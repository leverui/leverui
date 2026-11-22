/** Small helpers shared by the generated CSS variable pages. */

/** Sorts names with numbers by value, so `2` comes before `10`. */
export const sorter = new Intl.Collator('en', { numeric: true });

/** Show a CSS value as code, safe inside a table cell. */
export function code(value) {
  return `\`${String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')}\``;
}

/** The part of a variable after its category prefix, such as `blue-500`. */
export function suffix(entry, prefix) {
  return entry.variable.slice(`--leverui-${prefix}-`.length).replaceAll('\\', '');
}

/** Order names with numbers by value, so `2` comes before `10`. */
export function natural(prefix) {
  return (
    /** Compare two variables by the name after their prefix. */
    (left, right) => sorter.compare(suffix(left, prefix), suffix(right, prefix))
  );
}
