import { createEffect, createSignal, type Accessor } from 'solid-js';
import { listenMediaQuery } from './media-query-listener';

/** Static queries or an accessor for changing query lists. */
export type MediaQueries = readonly string[] | Accessor<readonly string[]>;

/** Browser selection and server fallback options for media queries. */
export interface UseMediaQueryOptions {
  fallback?: readonly boolean[] | Accessor<readonly boolean[]> | undefined;
  ssr?: boolean | undefined;
  /** Select the browser window used for media queries, such as an iframe window. */
  getWindow?: (() => Window | undefined) | undefined;
}

/** Read a static query list or its current Solid value. */
function readQueries(input: MediaQueries): readonly string[] {
  return typeof input === 'function' ? input() : input;
}

/** Read the fallback flags in the same order as the current queries. */
function readFallback(options: UseMediaQueryOptions, length: number): boolean[] {
  const input = options.fallback;
  const flags = typeof input === 'function' ? input() : input;
  return Array.from(
    { length },
    /** Treat an absent fallback flag as false. */
    (_, index) => Boolean(flags?.[index]),
  );
}

/** Resolve a custom window while remaining safe during server rendering. */
function selectedWindow(options: UseMediaQueryOptions): Window | undefined {
  return options.getWindow?.() ?? (typeof window === 'undefined' ? undefined : window);
}

/** Read all current matches from one browser window. */
function readMatches(currentWindow: Window, queries: readonly string[]): boolean[] {
  return queries.map(
    /** Evaluate a query using the browser's CSS media semantics. */
    (query) => currentWindow.matchMedia(query).matches,
  );
}

/** Observe media queries as a Solid accessor with SSR fallback support. */
export function useMediaQuery(
  queries: MediaQueries,
  options: UseMediaQueryOptions = {},
): Accessor<readonly boolean[]> {
  const initialQueries = readQueries(queries);
  const initialWindow = options.ssr === false ? selectedWindow(options) : undefined;
  const [values, setValues] = createSignal<readonly boolean[]>(
    initialWindow
      ? readMatches(initialWindow, initialQueries)
      : readFallback(options, initialQueries.length),
  );

  createEffect(
    /** Track the query list and the window to match against. */
    () => ({ currentQueries: readQueries(queries), currentWindow: selectedWindow(options) }),
    /** Rebuild subscriptions when a reactive query list changes. */
    ({ currentQueries, currentWindow }) => {
      if (!currentWindow) {
        setValues(readFallback(options, currentQueries.length));
        return;
      }
      const lists = currentQueries.map(
        /** Keep one media list for each current query. */
        (query) => currentWindow.matchMedia(query),
      );
      /** Publish the browser's current matches after any query changes. */
      function update(): void {
        setValues(
          lists.map(
            /** Read a live match rather than an event snapshot. */
            (list) => list.matches,
          ),
        );
      }
      update();
      const cleanups = lists.map(
        /** Observe each media list for the lifetime of this effect. */
        (list) => listenMediaQuery(list, update),
      );
      return (
        /** Release obsolete browser listeners before resubscribing. */
        () => {
          for (const cleanup of cleanups) cleanup();
        }
      );
    },
  );

  return values;
}
