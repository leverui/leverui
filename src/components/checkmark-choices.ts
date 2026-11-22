import {
  readResponsiveBooleans,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import {
  isCheckmarkSize,
  isCheckmarkVariant,
  type CheckmarkSize,
  type CheckmarkVariant,
} from './checkmark-options';
import type { CheckmarkChoice } from './checkmark-props';

export interface CheckmarkChoices {
  size: ResponsiveValues<CheckmarkSize>;
  variant: ResponsiveValues<CheckmarkVariant>;
  filled: ResponsiveValues<boolean>;
}

/** Validate one finite Checkmark choice at supported breakpoints. */
function readChoice<T extends string>(
  value: CheckmarkChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError(`Checkmark ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice === undefined) continue;
    if (!isAllowed(choice)) throw new TypeError(`Checkmark ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Validate optional filled choices and keep explicit false overrides. */
function readFilled(value: CheckmarkChoice<boolean> | undefined): ResponsiveValues<boolean> {
  const selected = readResponsiveBooleans(value);
  if (!selected) throw new TypeError('Checkmark filled uses an unsupported breakpoint or value.');
  return { base: false, ...selected };
}

/** Read the authored size, treatment, and fill selections. */
export function readCheckmarkChoices(
  size: CheckmarkChoice<CheckmarkSize> | undefined,
  variant: CheckmarkChoice<CheckmarkVariant> | undefined,
  filled: CheckmarkChoice<boolean> | undefined,
): CheckmarkChoices {
  return {
    size: readChoice(size, isCheckmarkSize, 'md', 'size'),
    variant: readChoice(variant, isCheckmarkVariant, 'solid', 'variant'),
    filled: readFilled(filled),
  };
}

/** Accept a nonempty palette name for authored Checkmark colors. */
export function readCheckmarkPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Checkmark colorPalette must be a nonempty string.');
  }
  return value.trim();
}
