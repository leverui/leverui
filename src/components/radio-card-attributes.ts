import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { RadioCardChoices } from './radio-card-choices';

type ChoiceName = keyof RadioCardChoices;
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Bind finite Card choices to native root and item CSS state hooks. */
export function radioCardAttributes(
  selected: RadioCardChoices,
): Partial<Record<AttributeName, string | undefined>> {
  return {
    'data-size': selected.size.base,
    'data-size-sm': selected.size.sm,
    'data-size-md': selected.size.md,
    'data-size-lg': selected.size.lg,
    'data-size-xl': selected.size.xl,
    'data-size-2xl': selected.size['2xl'],
    'data-variant': selected.variant.base,
    'data-variant-sm': selected.variant.sm,
    'data-variant-md': selected.variant.md,
    'data-variant-lg': selected.variant.lg,
    'data-variant-xl': selected.variant.xl,
    'data-variant-2xl': selected.variant['2xl'],
    'data-align': selected.align.base,
    'data-align-sm': selected.align.sm,
    'data-align-md': selected.align.md,
    'data-align-lg': selected.align.lg,
    'data-align-xl': selected.align.xl,
    'data-align-2xl': selected.align['2xl'],
    'data-justify': selected.justify?.base,
    'data-justify-sm': selected.justify?.sm,
    'data-justify-md': selected.justify?.md,
    'data-justify-lg': selected.justify?.lg,
    'data-justify-xl': selected.justify?.xl,
    'data-justify-2xl': selected.justify?.['2xl'],
    'data-orientation': selected.orientation.base,
    'data-orientation-sm': selected.orientation.sm,
    'data-orientation-md': selected.orientation.md,
    'data-orientation-lg': selected.orientation.lg,
    'data-orientation-xl': selected.orientation.xl,
    'data-orientation-2xl': selected.orientation['2xl'],
  };
}
