import { createEffect, createSignal, type Accessor } from 'solid-js';
import type { CommandItem } from './command-types';

/** Context for a remote Command search or another page of its results. */
export interface CommandLoadDetails<T extends CommandItem> {
  readonly query: string;
  readonly page: T | null;
  readonly signal: AbortSignal;
  readonly cursor?: string | undefined;
}

/** Remote results may include a cursor for the next page. */
export type CommandLoadResult<T extends CommandItem> =
  readonly T[] | { readonly items: readonly T[]; readonly cursor?: string | undefined };

/** Read-only async state and actions consumed by the Command collection. */
export interface CommandAsyncState<T extends CommandItem> {
  readonly items: Accessor<readonly T[]>;
  readonly loading: Accessor<boolean>;
  readonly error: Accessor<Error | undefined>;
  readonly hasMore: Accessor<boolean>;
  /** Reissue the current page and query request. */
  readonly reload: () => void;
  /** Append one remote page when a cursor is available. */
  readonly loadMore: () => void;
}

/** Normalize both array and cursor-bearing load results. */
function unpackResult<T extends CommandItem>(
  result: CommandLoadResult<T>,
): { items: readonly T[]; cursor: string | undefined } {
  return 'items' in result
    ? { items: result.items, cursor: result.cursor }
    : { items: result, cursor: undefined };
}

/** Keep remote search results reactive and cancel superseded requests. */
export function useCommandAsync<T extends CommandItem>(
  load: Accessor<((details: CommandLoadDetails<T>) => Promise<CommandLoadResult<T>>) | undefined>,
  query: Accessor<string>,
  page: Accessor<T | null>,
): CommandAsyncState<T> {
  const [items, setItems] = createSignal<readonly T[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error>();
  const [cursor, setCursor] = createSignal<string>();
  const [revision, setRevision] = createSignal(0);
  let pageRequest: AbortController | undefined;
  let moreRequest: AbortController | undefined;

  /** Convert unknown rejection values into an actionable Error. */
  function fail(reason: unknown): void {
    setError(reason instanceof Error ? reason : new Error(String(reason)));
  }

  createEffect(
    /** Track the remote source, query, page, and reload revision. */
    () => ({
      requestLoad: load(),
      requestQuery: query(),
      requestPage: page(),
      revision: revision(),
    }),
    /** Replace results whenever the remote source, query, or page changes. */
    ({ requestLoad, requestQuery, requestPage }) => {
      pageRequest?.abort();
      moreRequest?.abort();
      setItems([]);
      setCursor(undefined);
      setError(undefined);
      if (!requestLoad) {
        setLoading(false);
        return;
      }
      const controller = new AbortController();
      pageRequest = controller;
      setLoading(true);
      void requestLoad({ query: requestQuery, page: requestPage, signal: controller.signal })
        .then(
          /** Adopt only the result of the current request. */
          (result) => {
            if (controller.signal.aborted) return;
            const next = unpackResult(result);
            setItems([...next.items]);
            setCursor(next.cursor);
          },
        )
        .catch(
          /** Ignore cancellation while reporting genuine load errors. */
          (reason: unknown) => {
            if (!controller.signal.aborted) fail(reason);
          },
        )
        .finally(
          /** Stop the loading state for this request only. */
          () => {
            if (!controller.signal.aborted) setLoading(false);
          },
        );
      return (
        /** Abort page and pagination work when this search is replaced. */
        () => {
          controller.abort();
          moreRequest?.abort();
        }
      );
    },
  );

  /** Re-run a search even when its query and page are unchanged. */
  function reload(): void {
    setRevision((value) => value + 1);
  }

  /** Append a cursor page without discarding the current result list. */
  function loadMore(): void {
    const requestLoad = load();
    const nextCursor = cursor();
    if (!requestLoad || nextCursor === undefined || loading()) return;
    moreRequest?.abort();
    const controller = new AbortController();
    moreRequest = controller;
    setLoading(true);
    setError(undefined);
    void requestLoad({
      query: query(),
      page: page(),
      cursor: nextCursor,
      signal: controller.signal,
    })
      .then(
        /** Append only results from the active page request. */
        (result) => {
          if (controller.signal.aborted) return;
          const next = unpackResult(result);
          setItems((current) => [...current, ...next.items]);
          setCursor(next.cursor);
        },
      )
      .catch(
        /** Leave current results intact when pagination fails. */
        (reason: unknown) => {
          if (!controller.signal.aborted) fail(reason);
        },
      )
      .finally(
        /** Clear loading only for the latest pagination request. */
        () => {
          if (!controller.signal.aborted) setLoading(false);
        },
      );
  }

  return {
    items,
    loading,
    error,
    hasMore:
      /** A cursor, including the empty string, means another page exists. */
      () => cursor() !== undefined,
    reload,
    loadMore,
  };
}
