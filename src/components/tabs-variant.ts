import { hasBreakpointOverride } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const tabsVariants = ['line', 'subtle', 'enclosed', 'outline', 'plain'] as const;
export type TabsVariant = (typeof tabsVariants)[number];
const allowedVariants = new Set<string>(tabsVariants);

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type TabsVariantAttribute =
  'data-variant' | 'data-variant-responsive' | `data-variant-${Breakpoint}`;

/** Reflect every finite responsive Tabs variant for authored CSS. */
export function tabsVariantAttributes(
  value: unknown,
): Partial<Record<TabsVariantAttribute, string | undefined>> {
  const variant = readFiniteResponsiveChoice(value, allowedVariants, 'line', 'Tabs variant');
  return {
    'data-variant': variant.base,
    'data-variant-responsive': hasBreakpointOverride(variant) ? '' : undefined,
    'data-variant-sm': variant.sm,
    'data-variant-md': variant.md,
    'data-variant-lg': variant.lg,
    'data-variant-xl': variant.xl,
    'data-variant-2xl': variant['2xl'],
  };
}
