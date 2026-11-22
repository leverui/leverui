export const alertParts = ['title', 'description', 'root', 'indicator', 'content'] as const;

export type AlertPart = (typeof alertParts)[number];

/** Show a CSS hook for the selected public Alert part. */
export function alertExplorerCode(part: AlertPart): string {
  return `/* Target the ${part} part from your own stylesheet. */
.my-alert .leverui-alert__${part} {
  outline: 2px solid var(--leverui-colors-blue-500);
}`;
}
