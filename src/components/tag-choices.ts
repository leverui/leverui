import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { ResponsiveTagChoice, TagRootBaseProps, TagSize, TagVariant } from './tag-props';

export interface TagChoices {
  size: ResponsiveValues<TagSize>;
  variant: ResponsiveValues<TagVariant>;
}

/** Recognize only Tag sizes with authored CSS rules. */
function isTagSize(value: string): value is TagSize {
  return value === 'sm' || value === 'md' || value === 'lg' || value === 'xl';
}

/** Recognize only authored Tag color treatments. */
function isTagVariant(value: string): value is TagVariant {
  return value === 'subtle' || value === 'solid' || value === 'outline' || value === 'surface';
}

/** Validate one finite Tag choice at ordinary responsive breakpoints. */
function readChoice<T extends string>(
  value: ResponsiveTagChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError(`Tag ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice === undefined) continue;
    if (!isAllowed(choice)) throw new TypeError(`Tag ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Read finite size and treatment selections for authored CSS. */
export function readTagChoices(
  sizeValue: TagRootBaseProps['size'],
  variantValue: TagRootBaseProps['variant'],
): TagChoices {
  return {
    size: readChoice(sizeValue, isTagSize, 'md', 'size'),
    variant: readChoice(variantValue, isTagVariant, 'surface', 'variant'),
  };
}

/** Accept a nonempty scalar palette name for authored Tag tokens. */
export function readTagPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Tag colorPalette must be a nonempty string.');
  }
  return value.trim();
}
