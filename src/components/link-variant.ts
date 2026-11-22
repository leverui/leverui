import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type LinkVariant = 'plain' | 'underline';
export type ResponsiveLinkVariant =
  LinkVariant | readonly (LinkVariant | null)[] | ResponsiveValues<LinkVariant>;

/** Read only Link treatments covered by authored breakpoint selectors. */
export function readLinkVariants(
  value: ResponsiveLinkVariant | undefined,
): ResponsiveValues<LinkVariant> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError('Link variant requires plain or underline.');
  const result: ResponsiveValues<LinkVariant> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const variant = selected[breakpoint];
    if (variant === undefined) continue;
    if (variant !== 'plain' && variant !== 'underline') {
      throw new TypeError('Link variant requires plain or underline.');
    }
    result[breakpoint] = variant;
  }
  return result;
}
