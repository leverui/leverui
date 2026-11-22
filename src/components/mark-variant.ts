import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type MarkVariant = 'subtle' | 'solid' | 'text' | 'plain';
export type ResponsiveMarkVariant =
  MarkVariant | readonly (MarkVariant | null)[] | ResponsiveValues<MarkVariant>;

const authoredVariants = new Set<string>(['subtle', 'solid', 'text', 'plain']);

/** Validate one Mark treatment against the authored CSS selectors. */
function isMarkVariant(value: string): value is MarkVariant {
  return authoredVariants.has(value);
}

/** Read only supported Mark variants at ordinary breakpoints. */
export function readMarkVariants(
  value: ResponsiveMarkVariant | undefined,
): ResponsiveValues<MarkVariant> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError('Mark variant requires subtle, solid, text, or plain.');
  const result: ResponsiveValues<MarkVariant> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const variant = selected[breakpoint];
    if (variant === undefined) continue;
    if (!isMarkVariant(variant)) {
      throw new TypeError('Mark variant requires subtle, solid, text, or plain.');
    }
    result[breakpoint] = variant;
  }
  return result;
}
