import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type ListVariant = 'marker' | 'plain';
export type ListAlignment = 'start' | 'center' | 'end';
export type ResponsiveListChoice<T extends string> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

const listVariants = new Set<string>(['marker', 'plain']);
const listAlignments = new Set<string>(['start', 'center', 'end']);

/** Validate finite List choices before exposing them to authored CSS. */
function readListChoices<T extends string>(
  value: ResponsiveListChoice<T> | undefined,
  allowed: ReadonlySet<string>,
  label: string,
): ResponsiveValues<T> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError(`List ${label} uses an unsupported breakpoint or value.`);
  const result: ResponsiveValues<T> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!allowed.has(choice)) throw new TypeError(`List ${label} is unsupported: ${choice}.`);
    result[breakpoint] = choice as T;
  }
  return result;
}

/** Read marker or plain treatment at supported responsive breakpoints. */
export function readListVariants(
  value: ResponsiveListChoice<ListVariant> | undefined,
): ResponsiveValues<ListVariant> {
  return { base: 'marker', ...readListChoices(value, listVariants, 'variant') };
}

/** Read start, center, or end alignment at supported breakpoints. */
export function readListAlignments(
  value: ResponsiveListChoice<ListAlignment> | undefined,
): ResponsiveValues<ListAlignment> {
  return readListChoices(value, listAlignments, 'align');
}
