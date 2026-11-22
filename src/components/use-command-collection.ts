import {
  createListCollection,
  type CollectionOptions,
  type ListCollection,
} from '../primitives/components/collection';
import { createMemo, createSignal, type Accessor } from 'solid-js';
import { buildCommandTree, commandDescendants, type CommandTree } from './command-collection-tree';
import { useCommandNavigation, type CommandInputKeyEvent } from './command-collection-navigation';
import {
  useCommandAsync,
  type CommandLoadDetails,
  type CommandLoadResult,
} from './command-collection-async';
import { buildCommandResults } from './command-collection-results';
import type { CommandItem, CommandSelectionDetails } from './command-types';

/** Local search, grouping, and page options for a Command data source. */
export interface UseCommandCollectionProps<T extends CommandItem> extends Omit<
  CollectionOptions<T>,
  'items'
> {
  initialItems?: readonly T[] | undefined;
  /** Override fuzzy scoring; null trusts the caller's result order. */
  filter?: ((item: T, query: string) => number) | null | undefined;
  limit?: number | undefined;
  query?: string | undefined;
  /** Observe search changes when the query is controlled or uncontrolled. */
  onQueryChange?: ((query: string) => void) | undefined;
  filterQuery?: string | undefined;
  deepSearch?: boolean | undefined;
  /** Observe navigation into or out of a nested page. */
  onPageChange?: ((page: T | null) => void) | undefined;
  /** Load remote results for a query or page. */
  load?: ((details: CommandLoadDetails<T>) => Promise<CommandLoadResult<T>>) | undefined;
}

/** Reactive Command collection state exposed by the Solid accessor. */
export interface CommandCollectionState<T extends CommandItem> {
  readonly collection: ListCollection<T>;
  readonly query: string;
  readonly filterQuery: string;
  readonly page: T | null;
  readonly pages: readonly T[];
  readonly highlightedValue: string | null;
  readonly loading: boolean;
  readonly error: Error | undefined;
  readonly hasMore: boolean;
  /** Find the top ranked item for a query without changing state. */
  readonly getFirstMatch: (query: string) => T | undefined;
  /** Update the visible search query. */
  readonly search: (query: string) => void;
  /** Open a nested page by value. */
  readonly setPage: (value: string | null) => void;
  /** Return to the previous page when one exists. */
  readonly popPage: () => boolean;
  /** Check whether an item opens a nested page. */
  readonly isPage: (item: T) => boolean;
  /** Find an item's ancestors below the current page. */
  readonly getPath: (item: T) => T[];
  /** Clear search and page history. */
  readonly reset: (page?: string | null) => void;
  /** Open a page when the selected item has children. */
  readonly onSelect: (details: CommandSelectionDetails) => boolean;
  /** Apply Escape and empty Backspace page navigation; report whether the key was used. */
  readonly onInputKeyDown: (event: CommandInputKeyEvent) => boolean;
  /** Reissue the current remote request. */
  readonly reload: () => void;
  /** Append the next remote result page. */
  readonly loadMore: () => void;
}

export type UseCommandCollectionReturn<T extends CommandItem> = Accessor<CommandCollectionState<T>>;

/** Create a reactive Solid collection for Command search and nested pages. */
export function useCommandCollection<T extends CommandItem>(
  props: UseCommandCollectionProps<T> | Accessor<UseCommandCollectionProps<T>>,
): UseCommandCollectionReturn<T> {
  /** Read either a fixed options object or reactive caller props. */
  function readProps(): UseCommandCollectionProps<T> {
    return typeof props === 'function' ? props() : props;
  }

  const [uncontrolledQuery, setUncontrolledQuery] = createSignal('');
  const query = createMemo(
    /** Follow an external query when provided, otherwise the local input. */
    () => readProps().query ?? uncontrolledQuery(),
  );
  const filterQuery = createMemo(
    /** Permit deferred ranking without delaying the visible input value. */
    () => readProps().filterQuery ?? query(),
  );

  /** Change local state only when the caller has not supplied a query. */
  function search(value: string): void {
    const options = readProps();
    if (options.query === undefined) setUncontrolledQuery(value);
    options.onQueryChange?.(value);
  }

  /** Match the primitive's default collection value conversion. */
  function itemToValue(item: T): string {
    return readProps().itemToValue?.(item) ?? item.value ?? '';
  }

  const tree = createMemo<CommandTree<T>>(
    /** Reindex pages when the source items or value adapter changes. */
    () => buildCommandTree(readProps().initialItems ?? [], itemToValue),
  );
  const navigation = useCommandNavigation(
    tree,
    query,
    search,
    /** Read the latest page callback without capturing an old props object. */
    () => readProps().onPageChange,
  );
  const remote = useCommandAsync(
    /** Follow a changing remote loader. */
    () => readProps().load,
    query,
    navigation.page,
  );

  const scope = createMemo<readonly T[]>(
    /** Restrict results to the current page unless deep search is active. */
    () =>
      readProps().deepSearch && filterQuery()
        ? commandDescendants(tree(), navigation.pageKey())
        : (tree().children.get(navigation.pageKey()) ?? []),
  );

  /** Rank local and remote items with the current collection policy. */
  function rank(items: readonly T[], value: string): T[] {
    const options = readProps();
    return buildCommandResults(items, remote.items(), value, {
      itemToString: options.itemToString,
      groupBy: options.groupBy,
      filter: options.filter,
      limit: options.limit,
    });
  }

  const collection = createMemo<ListCollection<T>>(
    /** Give the primitive Combobox a fresh collection when ranking changes. */
    () => {
      const options = readProps();
      return createListCollection({
        items: rank(scope(), filterQuery()),
        ...(options.itemToValue && { itemToValue: options.itemToValue }),
        ...(options.itemToString && { itemToString: options.itemToString }),
        ...(options.isItemDisabled && { isItemDisabled: options.isItemDisabled }),
        groupBy: options.groupBy,
        groupSort: options.groupSort,
      });
    },
  );

  /** Rank immediately against the input query, even during deferred filtering. */
  function getFirstMatch(value: string): T | undefined {
    const items =
      readProps().deepSearch && value
        ? commandDescendants(tree(), navigation.pageKey())
        : (tree().children.get(navigation.pageKey()) ?? []);
    return rank(items, value)[0];
  }

  return createMemo(
    /** Expose changing values with stable navigation and search methods. */
    () => ({
      collection: collection(),
      query: query(),
      filterQuery: filterQuery(),
      page: navigation.page(),
      pages: navigation.pages(),
      highlightedValue: navigation.highlightedValue(),
      loading: remote.loading(),
      error: remote.error(),
      hasMore: remote.hasMore(),
      getFirstMatch,
      search,
      setPage: navigation.setPage,
      popPage: navigation.popPage,
      isPage: navigation.isPage,
      getPath: navigation.getPath,
      reset: navigation.reset,
      onSelect: navigation.onSelect,
      onInputKeyDown: navigation.onInputKeyDown,
      reload: remote.reload,
      loadMore: remote.loadMore,
    }),
  );
}
