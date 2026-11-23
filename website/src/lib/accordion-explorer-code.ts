export const accordionParts = [
  'root',
  'item',
  'itemTrigger',
  'itemContent',
  'itemIndicator',
  'itemBody',
] as const;

export type AccordionPart = (typeof accordionParts)[number];

/** Show a copyable CSS override for the selected Accordion part. */
export function accordionExplorerCode(part: AccordionPart): string {
  const selector = part === 'root' ? '.my-accordion' : `.my-accordion .leverui-accordion__${part}`;
  const declaration = '  outline: 2px solid var(--lui-colors-blue-500);\n  outline-offset: 2px;';
  return `/* Add class="my-accordion" to Accordion.Root. */\n${selector} {\n${declaration}\n}`;
}
