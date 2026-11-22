import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import {
  isTextareaSize,
  isTextareaVariant,
  type TextareaSize,
  type TextareaVariant,
} from './textarea-options';
import type { TextareaChoice } from './textarea-props';

export interface TextareaChoices {
  size: ResponsiveValues<TextareaSize>;
  variant: ResponsiveValues<TextareaVariant>;
}

/** Validate one finite Textarea choice at supported breakpoints. */
function readChoice<T extends string>(
  value: TextareaChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError(`Textarea ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice === undefined) continue;
    if (!isAllowed(choice)) throw new TypeError(`Textarea ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Read finite Textarea size and surface choices for authored CSS. */
export function readTextareaChoices(
  size: TextareaChoice<TextareaSize> | undefined,
  variant: TextareaChoice<TextareaVariant> | undefined,
): TextareaChoices {
  return {
    size: readChoice(size, isTextareaSize, 'md', 'size'),
    variant: readChoice(variant, isTextareaVariant, 'outline', 'variant'),
  };
}

/** Accept one nonempty palette name for the authored focus token. */
export function readTextareaPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Textarea colorPalette must be a nonempty string.');
  }
  return value.trim();
}
