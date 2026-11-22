import {
  readResponsiveBooleans,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { RadiomarkChoice, RadiomarkSize, RadiomarkVariant } from './radiomark-props';

const sizes = new Set<string>(['xs', 'sm', 'md', 'lg']);
const variants = new Set<string>(['solid', 'subtle', 'outline', 'inverted']);

/** Narrow a mark size to one with authored CSS. */
function isSize(value: string): value is RadiomarkSize {
  return sizes.has(value);
}

/** Narrow a mark treatment to one with authored CSS. */
function isVariant(value: string): value is RadiomarkVariant {
  return variants.has(value);
}

export interface RadiomarkChoices {
  size: ResponsiveValues<RadiomarkSize>;
  variant: ResponsiveValues<RadiomarkVariant>;
  filled: ResponsiveValues<boolean>;
}

/** Validate a finite responsive selection without resolving runtime styles. */
function readChoice<T extends string>(
  value: RadiomarkChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const parsed = readResponsiveStrings(value);
  if (!parsed) throw new TypeError(`Radiomark ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = parsed[breakpoint];
    if (choice === undefined) continue;
    if (!isAllowed(choice)) throw new TypeError(`Radiomark ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Read authored CSS choices and preserve explicit false fill overrides. */
export function readRadiomarkChoices(
  size: RadiomarkChoice<RadiomarkSize> | undefined,
  variant: RadiomarkChoice<RadiomarkVariant> | undefined,
  filled: RadiomarkChoice<boolean> | undefined,
): RadiomarkChoices {
  const parsedFilled = readResponsiveBooleans(filled);
  if (!parsedFilled)
    throw new TypeError('Radiomark filled uses an unsupported breakpoint or value.');
  return {
    size: readChoice(size, isSize, 'md', 'size'),
    variant: readChoice(variant, isVariant, 'solid', 'variant'),
    filled: { base: false, ...parsedFilled },
  };
}

/** Keep palette names safe for attribute-driven CSS selectors. */
export function readRadiomarkPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Radiomark colorPalette must be a nonempty string.');
  }
  return value.trim();
}
