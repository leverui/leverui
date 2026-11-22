import {
  readResponsiveBooleans,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type {
  ResponsiveTimelineChoice,
  TimelineRootBaseProps,
  TimelineSize,
  TimelineVariant,
} from './timeline-props';

export interface TimelineChoices {
  size: ResponsiveValues<TimelineSize>;
  variant: ResponsiveValues<TimelineVariant>;
  showLastSeparator: ResponsiveValues<boolean>;
}

/** Recognize only marker sizes backed by authored CSS. */
function isTimelineSize(value: string): value is TimelineSize {
  return value === 'sm' || value === 'md' || value === 'lg' || value === 'xl';
}

/** Recognize only authored marker treatments. */
function isTimelineVariant(value: string): value is TimelineVariant {
  return value === 'subtle' || value === 'solid' || value === 'outline' || value === 'plain';
}

/** Validate one finite string choice at ordinary breakpoints. */
function readChoice<T extends string>(
  value: ResponsiveTimelineChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError(`Timeline ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice === undefined) continue;
    if (!isAllowed(choice)) throw new TypeError(`Timeline ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Validate responsive last-line values without creating runtime styles. */
function readLastLine(
  value: TimelineRootBaseProps['showLastSeparator'],
): ResponsiveValues<boolean> {
  const choices = readResponsiveBooleans(value);
  if (!choices)
    throw new TypeError('Timeline showLastSeparator uses an unsupported breakpoint or value.');
  return { ...choices, base: choices.base ?? false };
}

/** Read finite Timeline choices for authored CSS selectors. */
export function readTimelineChoices(props: TimelineRootBaseProps): TimelineChoices {
  return {
    size: readChoice(props.size, isTimelineSize, 'md', 'size'),
    variant: readChoice(props.variant, isTimelineVariant, 'solid', 'variant'),
    showLastSeparator: readLastLine(props.showLastSeparator),
  };
}

/** Accept a nonempty scalar palette name for authored marker tokens. */
export function readTimelinePalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Timeline colorPalette must be a nonempty string.');
  }
  return value.trim();
}
