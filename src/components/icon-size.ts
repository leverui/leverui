import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveCssValue,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export const iconSizes = ['inherit', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type IconSize = (typeof iconSizes)[number];

const allowedSizes = new Set<string>(iconSizes);

/** Narrow a size to the authored Icon choices. */
function isIconSize(value: string): value is IconSize {
  return allowedSizes.has(value);
}

/** Validate Icon sizes at supported breakpoints and supply the native default. */
export function readIconSize(
  value: ResponsiveCssValue<IconSize> | undefined,
): ResponsiveValues<IconSize> {
  const parsed = readResponsiveStrings(value);
  if (!parsed) throw new TypeError('Icon size uses an unsupported breakpoint or value.');
  const selected: ResponsiveValues<IconSize> = { base: 'inherit' };
  for (const breakpoint of responsiveBreakpoints) {
    const size = parsed[breakpoint];
    if (size === undefined) continue;
    if (!isIconSize(size)) throw new TypeError(`Icon size is unsupported: ${size}.`);
    selected[breakpoint] = size;
  }
  return selected;
}
