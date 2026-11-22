import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { ResponsiveSpinnerSize, SpinnerSize } from './spinner-props';

const sizes = new Set<SpinnerSize>(['inherit', 'xs', 'sm', 'md', 'lg', 'xl']);

/** Validate responsive Spinner sizes against the authored stylesheet. */
export function readSpinnerSizes(
  value: ResponsiveSpinnerSize | undefined,
): ResponsiveValues<SpinnerSize> {
  const selected = readResponsiveStrings(value);
  if (!selected)
    throw new TypeError('Spinner size requires an authored size at ordinary breakpoints.');
  const result: ResponsiveValues<SpinnerSize> = { base: 'md' };
  for (const breakpoint of responsiveBreakpoints) {
    const size = selected[breakpoint];
    if (size === undefined) continue;
    if (!sizes.has(size as SpinnerSize)) {
      throw new TypeError('Spinner size requires an authored size at ordinary breakpoints.');
    }
    result[breakpoint] = size as SpinnerSize;
  }
  return result;
}
