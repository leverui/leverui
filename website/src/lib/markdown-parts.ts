/** A continuation file such as `toast.part-2.md`, joined after its page's own file. */
const markdownPartPattern = /\.part-(\d+)\.md$/;

/** Report whether a Markdown filename continues another page rather than starting one. */
export function isMarkdownPart(filename: string): boolean {
  return markdownPartPattern.test(filename);
}

/** Order a page's own file first, then its parts by number (so part 10 follows part 9). */
function partNumber(filename: string): number {
  return Number(markdownPartPattern.exec(filename)?.[1] ?? 1);
}

/** Join pages split into `.part-N.md` files, each split made by responsibility. */
export function mergeMarkdownParts(
  files: Readonly<Record<string, string>>,
): readonly (readonly [string, string])[] {
  const pages = new Map<string, { readonly part: number; readonly content: string }[]>();
  for (const [path, content] of Object.entries(files)) {
    const pagePath = path.replace(markdownPartPattern, '.md');
    pages.set(pagePath, [...(pages.get(pagePath) ?? []), { part: partNumber(path), content }]);
  }
  return [...pages]
    .sort(
      /** Keep page order independent of the bundler's file order. */
      ([first], [second]) => first.localeCompare(second),
    )
    .map(
      /** Return one complete Markdown document per page, in part order. */
      ([pagePath, parts]) =>
        [
          pagePath,
          [...parts]
            .sort(
              /** Number parts numerically rather than as text. */
              (first, second) => first.part - second.part,
            )
            .map(
              /** Keep only each part's Markdown. */
              (part) => part.content,
            )
            .join('\n'),
        ] as const,
    );
}
