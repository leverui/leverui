import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveBreakpoint,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { StatusRootBaseProps, StatusSize } from './status-props';

type SizeAttribute = 'data-size' | `data-size-${Exclude<ResponsiveBreakpoint, 'base'>}`;

/** Recognize only Status sizes with authored CSS rules. */
function isStatusSize(value: string): value is StatusSize {
  return value === 'sm' || value === 'md' || value === 'lg';
}

/** Read finite Status sizes in ordinary responsive breakpoint order. */
export function readStatusSize(value: StatusRootBaseProps['size']): ResponsiveValues<StatusSize> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError('Status size uses an unsupported breakpoint or value.');
  const selected: ResponsiveValues<StatusSize> = { base: 'md' };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice === undefined) continue;
    if (!isStatusSize(choice)) {
      throw new TypeError('Status size uses an unsupported breakpoint or value.');
    }
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Bind a finite Status size to native root attributes. */
export function statusSizeAttributes(
  selected: ResponsiveValues<StatusSize>,
): Partial<Record<SizeAttribute, string | undefined>> {
  return {
    'data-size': selected?.base,
    'data-size-sm': selected?.sm,
    'data-size-md': selected?.md,
    'data-size-lg': selected?.lg,
    'data-size-xl': selected?.xl,
    'data-size-2xl': selected?.['2xl'],
  };
}
