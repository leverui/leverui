import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { CheckmarkChoices } from './checkmark-choices';

type ChoiceName = keyof CheckmarkChoices;
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Bind Checkmark's finite styling choices to native SVG attributes. */
export function checkmarkAttributes(
  selected: CheckmarkChoices,
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
    'data-filled': selected.filled.base ? '' : undefined,
    'data-filled-sm': selected.filled.sm === undefined ? undefined : String(selected.filled.sm),
    'data-filled-md': selected.filled.md === undefined ? undefined : String(selected.filled.md),
    'data-filled-lg': selected.filled.lg === undefined ? undefined : String(selected.filled.lg),
    'data-filled-xl': selected.filled.xl === undefined ? undefined : String(selected.filled.xl),
    'data-filled-2xl':
      selected.filled['2xl'] === undefined ? undefined : String(selected.filled['2xl']),
  };
}
