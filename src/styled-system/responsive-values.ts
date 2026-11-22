export const responsiveBreakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number];
export type ResponsiveValues<T> = Partial<Record<ResponsiveBreakpoint, T>>;
/** Breakpoint values a caller may pass; an `undefined` slot is skipped like a missing one. */
export type ResponsiveInput<T> = Partial<Record<ResponsiveBreakpoint, T | undefined>>;
export type ResponsiveCssValue<T extends string | number = string | number> =
  T | readonly (T | null | undefined)[] | ResponsiveInput<T>;
export type ResponsiveBooleanValue =
  boolean | readonly (boolean | null | undefined)[] | ResponsiveInput<boolean>;

const breakpointNames = new Set<string>(responsiveBreakpoints);

/** Read supported breakpoint keys without interpreting state or range selectors. */
function readResponsiveValues<T extends string | boolean | number>(
  value: unknown,
  isValue: (candidate: unknown) => candidate is T,
): ResponsiveValues<T> | undefined {
  if (value === undefined) return {};
  if (isValue(value)) return { base: value };
  if (Array.isArray(value)) {
    if (value.length > responsiveBreakpoints.length) return undefined;
    const result: ResponsiveValues<T> = {};
    for (let index = 0; index < value.length; index += 1) {
      const candidate: unknown = value[index];
      if (candidate === null || candidate === undefined) continue;
      if (!isValue(candidate)) return undefined;
      const breakpoint = responsiveBreakpoints[index];
      if (!breakpoint) return undefined;
      result[breakpoint] = candidate;
    }
    return result;
  }
  if (!value || typeof value !== 'object') return undefined;
  const result: ResponsiveValues<T> = {};
  for (const [name, candidate] of Object.entries(value)) {
    if (!breakpointNames.has(name)) return undefined;
    if (candidate === undefined) continue;
    if (!isValue(candidate)) return undefined;
    result[name as ResponsiveBreakpoint] = candidate;
  }
  return result;
}

/** Keep string selections in source breakpoint order for authored CSS. */
export function readResponsiveStrings(value: unknown): ResponsiveValues<string> | undefined {
  return readResponsiveValues(
    value,
    /** Accept only scalar string selections at each breakpoint. */
    (candidate): candidate is string => typeof candidate === 'string',
  );
}

/** Keep boolean selections in source breakpoint order for authored CSS. */
export function readResponsiveBooleans(value: unknown): ResponsiveValues<boolean> | undefined {
  return readResponsiveValues(
    value,
    /** Accept only scalar boolean selections at each breakpoint. */
    (candidate): candidate is boolean => typeof candidate === 'boolean',
  );
}

/** Read scalar CSS values at ordinary breakpoints without resolving tokens. */
export function readResponsiveCssValues(
  value: unknown,
): ResponsiveValues<string | number> | undefined {
  return readResponsiveValues(
    value,
    /** Keep numeric flex values and strings while rejecting nested conditions. */
    (candidate): candidate is string | number =>
      typeof candidate === 'string' ||
      (typeof candidate === 'number' && Number.isFinite(candidate)),
  );
}

/** Detect range changes that would require removing a prior grow style. */
export function isAdditiveBooleanSelection(values: ResponsiveValues<boolean>): boolean {
  let enabled = false;
  for (const breakpoint of responsiveBreakpoints) {
    const value = values[breakpoint];
    if (value === true) enabled = true;
    if (value === false && enabled) return false;
  }
  return true;
}

/** Detect responsive orientation changes that need a distinct joined-edge rule. */
export function hasBreakpointOverride(values: ResponsiveValues<unknown>): boolean {
  for (const breakpoint of responsiveBreakpoints) {
    if (breakpoint !== 'base' && values[breakpoint] !== undefined) return true;
  }
  return false;
}
