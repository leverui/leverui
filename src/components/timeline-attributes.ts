import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { TimelineChoices } from './timeline-choices';

type ChoiceName = 'size' | 'variant' | 'show-last-separator';
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Bind finite Timeline choices to native list attributes. */
export function timelineAttributes(
  selected: TimelineChoices,
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
    'data-show-last-separator': String(selected.showLastSeparator.base),
    'data-show-last-separator-sm': selected.showLastSeparator.sm?.toString(),
    'data-show-last-separator-md': selected.showLastSeparator.md?.toString(),
    'data-show-last-separator-lg': selected.showLastSeparator.lg?.toString(),
    'data-show-last-separator-xl': selected.showLastSeparator.xl?.toString(),
    'data-show-last-separator-2xl': selected.showLastSeparator['2xl']?.toString(),
  };
}
