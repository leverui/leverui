import type { ResponsiveValues } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const tabsSizes = ['sm', 'md', 'lg'] as const;
export type TabsSize = (typeof tabsSizes)[number];
const allowedSizes = new Set<string>(tabsSizes);

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type TabsSizeAttribute = 'data-size' | `data-size-${Breakpoint}`;

/** Reflect finite responsive Tabs sizes without a component stylesheet. */
export function tabsSizeAttributes(
  value: unknown,
): Partial<Record<TabsSizeAttribute, TabsSize | undefined>> {
  const size: ResponsiveValues<TabsSize> = readFiniteResponsiveChoice(
    value,
    allowedSizes,
    'md',
    'Tabs size',
  );
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
  };
}
