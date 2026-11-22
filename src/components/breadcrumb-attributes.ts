import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { BreadcrumbChoices } from './breadcrumb-choices';

type ChoiceName = keyof BreadcrumbChoices;
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Expose finite Breadcrumb selections on its native navigation landmark. */
export function breadcrumbAttributes(
  selected: BreadcrumbChoices,
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
