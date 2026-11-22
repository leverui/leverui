import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { SeparatorChoices } from './separator-choices';

type ChoiceName = keyof SeparatorChoices;
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Reflect finite separator choices in stable CSS selectors. */
export function separatorAttributes(
  selected: SeparatorChoices,
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
    'data-orientation': selected.orientation.base,
    'data-orientation-sm': selected.orientation.sm,
    'data-orientation-md': selected.orientation.md,
    'data-orientation-lg': selected.orientation.lg,
    'data-orientation-xl': selected.orientation.xl,
    'data-orientation-2xl': selected.orientation['2xl'],
  };
}
