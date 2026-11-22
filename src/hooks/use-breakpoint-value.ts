import { createMemo, type Accessor } from 'solid-js';
import { breakpointThresholds, type BreakpointName } from './breakpoint-thresholds';
import { useBreakpoint, type UseBreakpointOptions } from './use-breakpoint';

/** Named viewport thresholds accepted by responsive values. */
export type { BreakpointName } from './breakpoint-thresholds';

/** Responsive values keyed by breakpoint or ordered from base upward. */
export type BreakpointValues<T> =
  Readonly<Partial<Record<BreakpointName, T>>> | readonly (T | null | undefined)[];

/** Browser selection and server fallback options for responsive values. */
export type UseBreakpointValueOptions = Omit<UseBreakpointOptions, 'breakpoints'>;

const breakpointNames = breakpointThresholds.map(
  /** Share the authored breakpoint order across responsive value calls. */
  (entry) => entry.name,
);

/** Narrow either mutable or readonly responsive arrays. */
function isValueArray<T>(values: BreakpointValues<T>): values is readonly (T | null | undefined)[] {
  return Array.isArray(values);
}

/** Convert the array form to a named, sparse breakpoint record. */
function normalizeValues<T>(
  values: BreakpointValues<T>,
  names: readonly string[],
): Partial<Record<string, T>> {
  if (!isValueArray(values)) return { ...values };
  const normalized: Partial<Record<string, T>> = {};
  values.forEach(
    /** Retain only array entries with a defined responsive value. */
    (value, index) => {
      const name = names[index];
      if (name && value !== null && value !== undefined) normalized[name] = value;
    },
  );
  return normalized;
}

/** Read a responsive value through the shared breakpoint observer. */
export function useBreakpointValue<T>(
  values: BreakpointValues<T>,
  options: UseBreakpointValueOptions = {},
): Accessor<T | undefined> {
  const normalized = createMemo(
    /** Map array slots to the same names used by authored CSS media rules. */
    () => normalizeValues(values, breakpointNames),
  );
  const breakpoint = useBreakpoint({
    ...options,
    /** Match only keys supplied by this responsive value. */
    breakpoints: () => {
      return Object.keys(normalized()) as BreakpointName[];
    },
  });
  return createMemo(
    /** Resolve the value selected by the current matching breakpoint. */
    () => normalized()[breakpoint()],
  );
}
