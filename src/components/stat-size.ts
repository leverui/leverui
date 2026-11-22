import {
  readResponsiveStrings,
  type ResponsiveBreakpoint,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { StatRootBaseProps } from './stat-props';

const sizes = new Set(['sm', 'md', 'lg']);

/** Accept only Stat sizes expressible by the authored breakpoint rules. */
export function readStatSize(
  value: StatRootBaseProps['size'],
): ResponsiveValues<string> | undefined {
  const choices = readResponsiveStrings(value);
  if (
    !choices ||
    Object.values(choices).some(
      /** Reject sizes without authored CSS rules. */
      (choice) => choice !== undefined && !sizes.has(choice),
    )
  )
    throw new TypeError('Stat size uses an unsupported breakpoint or value.');
  return { ...choices, base: choices.base ?? 'md' };
}

/** Expose finite sizes on the semantic description list. */
export function statSizeAttributes(
  selected: ResponsiveValues<string> | undefined,
): Partial<
  Record<'data-size' | `data-size-${Exclude<ResponsiveBreakpoint, 'base'>}`, string | undefined>
> {
  return {
    'data-size': selected?.base,
    'data-size-sm': selected?.sm,
    'data-size-md': selected?.md,
    'data-size-lg': selected?.lg,
    'data-size-xl': selected?.xl,
    'data-size-2xl': selected?.['2xl'],
  };
}
