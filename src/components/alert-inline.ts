import {
  readResponsiveBooleans,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

/** Validate the responsive layout selection for an Alert's content. */
export function readAlertInline(value: unknown): ResponsiveValues<boolean> {
  const choices = readResponsiveBooleans(value);
  if (!choices) throw new TypeError('Alert inline uses an unsupported breakpoint or value.');
  const selected: ResponsiveValues<boolean> = { base: false };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice !== undefined) selected[breakpoint] = choice;
  }
  return selected;
}

/** Reflect responsive inline choices as native CSS selectors. */
export function alertInlineAttributes(
  selected: ResponsiveValues<boolean>,
): Record<string, string | undefined> {
  return {
    'data-inline': String(selected.base),
    'data-inline-sm': selected.sm?.toString(),
    'data-inline-md': selected.md?.toString(),
    'data-inline-lg': selected.lg?.toString(),
    'data-inline-xl': selected.xl?.toString(),
    'data-inline-2xl': selected['2xl']?.toString(),
  };
}
