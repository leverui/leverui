export const scrollAreaParts = [
  'root',
  'viewport',
  'content',
  'scrollbar',
  'thumb',
  'corner',
] as const;
export type ScrollAreaPart = (typeof scrollAreaParts)[number];

/** Show a copyable CSS override for the selected Scroll Area part. */
export function scrollAreaExplorerCode(part: ScrollAreaPart): string {
  const selector =
    part === 'root' ? '.my-scroll-area' : `.my-scroll-area .leverui-scroll-area__${part}`;
  const declarations =
    '  outline: 2px solid var(--leverui-colors-blue-500);\n  outline-offset: 2px;';

  return `/* Add class="my-scroll-area" to ScrollArea.Root. */\n${selector} {\n${declarations}\n}`;
}
