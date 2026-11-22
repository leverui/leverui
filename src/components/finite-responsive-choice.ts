import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type FiniteResponsiveChoice<T extends string> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

/** Validate a family-specific finite choice at supported CSS breakpoints. */
export function readFiniteResponsiveChoice<T extends string>(
  value: unknown,
  allowed: ReadonlySet<string>,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError(`${label} has an unsupported breakpoint or value.`);
  const result: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!allowed.has(choice)) throw new TypeError(`${label} is unsupported: ${choice}.`);
    // The runtime set check narrows the finite choice for this family.
    result[breakpoint] = choice as T;
  }
  return result;
}
