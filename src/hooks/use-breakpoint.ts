import { createMemo, type Accessor } from 'solid-js';
import { breakpointThresholds, type BreakpointName } from './breakpoint-thresholds';
import { useMediaQuery } from './use-media-query';

/** Selection and browser options for the active breakpoint accessor. */
export interface UseBreakpointOptions {
  fallback?: BreakpointName;
  ssr?: boolean;
  /** Select the browser window used for media queries, such as an iframe window. */
  getWindow?: () => Window | undefined;
  /** Limit matching to these names, or supply a reactive list of names. */
  breakpoints?: readonly BreakpointName[] | Accessor<readonly BreakpointName[]>;
}

interface BreakpointQuery {
  name: BreakpointName;
  query: string;
  fallback: boolean;
}

/** Read a static breakpoint filter or its current Solid value. */
function selectedNames(options: UseBreakpointOptions): readonly BreakpointName[] | undefined {
  const names = options.breakpoints;
  return typeof names === 'function' ? names() : names;
}

/** Build named CSS queries in authored CSS order before applying a name filter. */
function breakpointQueries(options: UseBreakpointOptions): BreakpointQuery[] {
  const fallback = options.fallback ?? 'base';
  const allowed = selectedNames(options);
  const result: BreakpointQuery[] = [];
  let fallbackPassed = false;

  /** Apply fallback flags before filtering out unused breakpoints. */
  function append(name: BreakpointName, min: string): void {
    const item = { name, query: `(min-width: ${min})`, fallback: !fallbackPassed };
    if (name === fallback) fallbackPassed = true;
    if (!allowed || allowed.includes(name)) result.push(item);
  }

  for (const entry of breakpointThresholds) append(entry.name, entry.min);
  return result;
}

/** Read the highest matching static CSS breakpoint as a Solid accessor. */
export function useBreakpoint(options: UseBreakpointOptions = {}): Accessor<BreakpointName> {
  const entries = createMemo(
    /** Follow reactive filters over the authored breakpoint names. */
    () => breakpointQueries(options),
  );
  const matches = useMediaQuery(
    /** Keep browser queries aligned with the current entry list. */
    () =>
      entries().map(
        /** Select the CSS query for one named breakpoint. */
        (entry) => entry.query,
      ),
    {
      /** Keep the SSR flags aligned with the same entry list. */
      fallback: () =>
        entries().map(
          /** Preserve the fallback boundary. */
          (entry) => entry.fallback,
        ),
      ssr: options.ssr,
      getWindow: options.getWindow,
    },
  );

  return createMemo(
    /** Choose the last matching entry or the requested fallback. */
    () => {
      const currentEntries = entries();
      const currentMatches = matches();
      for (let index = currentEntries.length - 1; index >= 0; index--) {
        const entry = currentEntries[index];
        if (entry && currentMatches[index]) return entry.name;
      }
      return options.fallback ?? 'base';
    },
  );
}
