import { createMemo, createSignal, type Accessor } from 'solid-js';
import {
  commandAncestors,
  COMMAND_ROOT_PAGE,
  updateCommandHistory,
  type CommandTree,
} from './command-collection-tree';
import type { CommandItem, CommandSelectionDetails } from './command-types';

/** A native input event with the current input retained for page navigation. */
export type CommandInputKeyEvent = KeyboardEvent & { currentTarget: HTMLInputElement };

/** Page state and navigation actions shared by Command collection consumers. */
export interface CommandNavigation<T extends CommandItem> {
  readonly page: Accessor<T | null>;
  readonly pages: Accessor<readonly T[]>;
  readonly pageKey: Accessor<string>;
  readonly highlightedValue: Accessor<string | null>;
  /** Open a page by item value or return to the root. */
  readonly setPage: (value: string | null) => void;
  /** Restore the previously opened page when possible. */
  readonly popPage: () => boolean;
  /** Check whether an item opens another page. */
  readonly isPage: (item: T) => boolean;
  /** List an item's ancestors below the current page. */
  readonly getPath: (item: T) => T[];
  /** Clear search history and optionally start inside a page. */
  readonly reset: (page?: string | null) => void;
  /** Open a selected page item without running its action. */
  readonly onSelect: (details: CommandSelectionDetails) => boolean;
  /** Handle Escape and Backspace page navigation; report whether the key was used. */
  readonly onInputKeyDown: (event: CommandInputKeyEvent) => boolean;
}

/** Coordinate nested pages without coupling ranking to dialog state. */
export function useCommandNavigation<T extends CommandItem>(
  tree: Accessor<CommandTree<T>>,
  query: Accessor<string>,
  search: (value: string) => void,
  onPageChange: () => ((page: T | null) => void) | undefined,
): CommandNavigation<T> {
  const [pageValue, setPageValue] = createSignal<string | null>(null);
  const [highlightedValue, setHighlightedValue] = createSignal<string | null>(null);
  const savedQueries = new Map<string, string>();
  let history: Array<string | null> = [];
  const page = createMemo(
    /** Resolve the current page against the latest item tree. */
    () => tree().items.get(pageValue() ?? '') ?? null,
  );
  const pageKey = createMemo(
    /** Use a separate root key that cannot collide with ordinary item values. */
    () => {
      const current = page();
      return current ? tree().toValue(current) : COMMAND_ROOT_PAGE;
    },
  );
  const pages = createMemo<readonly T[]>(
    /** Include every ancestor from the root to the current page. */
    () => {
      const current = page();
      return current ? [...commandAncestors(tree(), current), current] : [];
    },
  );

  /** Move to a valid page and restore that page's previous query. */
  function navigate(value: string | null, push: boolean): void {
    const current = pageValue();
    if (value === current || (value !== null && !tree().items.has(value))) return;
    history = updateCommandHistory(history, current, value, push);
    savedQueries.set(current ?? COMMAND_ROOT_PAGE, query());
    search(savedQueries.get(value ?? COMMAND_ROOT_PAGE) ?? '');
    setPageValue(value);
    setHighlightedValue(push ? null : current);
    onPageChange()?.(value === null ? null : (tree().items.get(value) ?? null));
  }

  /** Open a page from a caller or a selected item. */
  function setPage(value: string | null): void {
    navigate(value, true);
  }

  /** Step back through the actual visit trail. */
  function popPage(): boolean {
    const previous = history.at(-1);
    if (previous === undefined) return false;
    navigate(previous, false);
    return true;
  }

  /** Go to the parent page, even when the page was opened directly. */
  function goUp(): boolean {
    const trail = pages();
    if (trail.length === 0) return false;
    const parent = trail.at(-2);
    navigate(parent ? tree().toValue(parent) : null, false);
    return true;
  }

  /** Identify navigable pages with children or an explicit async page flag. */
  function isPage(item: T): boolean {
    return item.page === true || tree().children.has(tree().toValue(item));
  }

  /** Find the trail to an item relative to the open page. */
  function getPath(item: T): T[] {
    return commandAncestors(tree(), item, pageKey());
  }

  /** Clear previous searches and return to a known starting page. */
  function reset(value: string | null = null): void {
    savedQueries.clear();
    history = [];
    setPageValue(value !== null && tree().items.has(value) ? value : null);
    setHighlightedValue(null);
    search('');
  }

  /** Open a page item before the root selection handler can close the dialog. */
  function onSelect(details: CommandSelectionDetails): boolean {
    const item = tree().items.get(details.itemValue);
    if (!item || !isPage(item)) return false;
    setPage(details.itemValue);
    return true;
  }

  /**
   * Use Escape for history and empty Backspace for a direct page's parent.
   * Zag 2's combobox prevents every Escape, so Escape ignores that flag.
   */
  function onInputKeyDown(event: CommandInputKeyEvent): boolean {
    if (event.defaultPrevented && event.key !== 'Escape') return false;
    const handled =
      event.key === 'Escape'
        ? popPage()
        : event.key === 'Backspace' && !event.currentTarget.value && goUp();
    if (handled) event.preventDefault();
    return handled;
  }

  return {
    page,
    pages,
    pageKey,
    highlightedValue,
    setPage,
    popPage,
    isPage,
    getPath,
    reset,
    onSelect,
    onInputKeyDown,
  };
}
