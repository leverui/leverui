import {
  readResponsiveBooleans,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveBreakpoint,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { TabsJustify } from './tabs-appearance';

type TabsLayoutAttribute =
  | 'data-fitted'
  | 'data-justify'
  | `data-fitted-${Exclude<ResponsiveBreakpoint, 'base'>}`
  | `data-justify-${Exclude<ResponsiveBreakpoint, 'base'>}`;

/** Narrow a string to one authored list alignment. */
function isTabsJustify(value: string): value is TabsJustify {
  return value === 'start' || value === 'center' || value === 'end';
}

/** Validate every selected alignment before exposing it to the DOM. */
function readTabsJustify(value: unknown): ResponsiveValues<TabsJustify> | undefined {
  const selected = readResponsiveStrings(value);
  if (!selected) return undefined;
  const result: ResponsiveValues<TabsJustify> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!isTabsJustify(choice)) return undefined;
    result[breakpoint] = choice;
  }
  return result;
}

/** Reflect fitted and alignment choices for static breakpoint CSS. */
export function tabsLayoutAttributes(
  fitted: unknown,
  justify: unknown,
): Partial<Record<TabsLayoutAttribute, string | undefined>> {
  const selectedFitted = readResponsiveBooleans(fitted);
  const selectedJustify = readTabsJustify(justify);
  if (!selectedFitted || !selectedJustify)
    throw new TypeError('Tabs layout uses an unsupported breakpoint or value.');
  return {
    'data-fitted': selectedFitted.base?.toString(),
    'data-fitted-sm': selectedFitted.sm?.toString(),
    'data-fitted-md': selectedFitted.md?.toString(),
    'data-fitted-lg': selectedFitted.lg?.toString(),
    'data-fitted-xl': selectedFitted.xl?.toString(),
    'data-fitted-2xl': selectedFitted['2xl']?.toString(),
    'data-justify': selectedJustify.base,
    'data-justify-sm': selectedJustify.sm,
    'data-justify-md': selectedJustify.md,
    'data-justify-lg': selectedJustify.lg,
    'data-justify-xl': selectedJustify.xl,
    'data-justify-2xl': selectedJustify['2xl'],
  };
}
