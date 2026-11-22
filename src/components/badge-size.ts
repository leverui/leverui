import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type ResponsiveBadgeSize =
  BadgeSize | readonly (BadgeSize | null)[] | ResponsiveValues<BadgeSize>;

const badgeSizes = new Set<string>(['xs', 'sm', 'md', 'lg']);

/** Validate one authored Badge size without accepting arbitrary CSS conditions. */
function isBadgeSize(value: string): value is BadgeSize {
  return badgeSizes.has(value);
}

/** Read responsive Badge sizes using only authored breakpoint selectors. */
export function readBadgeSizes(
  value: ResponsiveBadgeSize | undefined,
): ResponsiveValues<BadgeSize> {
  const selected = readResponsiveStrings(value);
  if (!selected)
    throw new TypeError('Badge size requires xs, sm, md, or lg at ordinary breakpoints.');
  const result: ResponsiveValues<BadgeSize> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const size = selected[breakpoint];
    if (size === undefined) continue;
    if (!isBadgeSize(size)) {
      throw new TypeError('Badge size requires xs, sm, md, or lg at ordinary breakpoints.');
    }
    result[breakpoint] = size;
  }
  return result;
}
