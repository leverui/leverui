import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { TagChoices } from './tag-choices';

type ChoiceName = keyof TagChoices;
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Bind finite Tag choices to native root attributes. */
export function tagAttributes(
  selected: TagChoices,
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
  };
}
