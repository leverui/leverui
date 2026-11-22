import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { KbdSize, KbdVariant, ResponsiveKbdChoice } from './kbd-props';

const sizes = new Set<KbdSize>(['sm', 'md', 'lg']);
const variants = new Set<KbdVariant>(['raised', 'outline', 'subtle', 'plain']);

export interface KbdChoices {
  size: ResponsiveValues<KbdSize>;
  variant: ResponsiveValues<KbdVariant>;
}

/** Validate finite Kbd choices at the authored breakpoints. */
function readChoices<Choice extends string>(
  value: ResponsiveKbdChoice<Choice> | undefined,
  allowed: ReadonlySet<Choice>,
  fallback: Choice,
  label: string,
): ResponsiveValues<Choice> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError(`Kbd ${label} requires authored breakpoint choices.`);
  const result: ResponsiveValues<Choice> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!allowed.has(choice as Choice)) {
      throw new TypeError(`Kbd ${label} requires authored breakpoint choices.`);
    }
    result[breakpoint] = choice as Choice;
  }
  return result;
}

/** Read Kbd size and treatment without resolving style objects. */
export function readKbdChoices(
  size: ResponsiveKbdChoice<KbdSize> | undefined,
  variant: ResponsiveKbdChoice<KbdVariant> | undefined,
): KbdChoices {
  return {
    size: readChoices(size, sizes, 'md', 'size'),
    variant: readChoices(variant, variants, 'raised', 'variant'),
  };
}
