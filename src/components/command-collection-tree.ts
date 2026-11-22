import type { CommandItem } from './command-types';

export const COMMAND_ROOT_PAGE = '\0root';

/** Index Command items by value and by their parent page. */
export interface CommandTree<T extends CommandItem> {
  readonly items: ReadonlyMap<string, T>;
  readonly children: ReadonlyMap<string, readonly T[]>;
  /** Resolve an item's value using the collection's configured converter. */
  readonly toValue: (item: T) => string;
}

/** Build page relationships without changing the caller's source array. */
export function buildCommandTree<T extends CommandItem>(
  items: readonly T[],
  toValue: (item: T) => string,
): CommandTree<T> {
  const byValue = new Map<string, T>();
  for (const item of items) byValue.set(toValue(item), item);
  const children = new Map<string, T[]>();
  for (const item of items) {
    const parent = item.parent && byValue.has(item.parent) ? item.parent : COMMAND_ROOT_PAGE;
    const siblings = children.get(parent) ?? [];
    siblings.push(item);
    children.set(parent, siblings);
  }
  return { items: byValue, children, toValue };
}

/** Find an item's parents down to the current page. */
export function commandAncestors<T extends CommandItem>(
  tree: CommandTree<T>,
  item: T,
  stop = COMMAND_ROOT_PAGE,
): T[] {
  const path: T[] = [];
  let parent = tree.items.get(item.parent ?? '');
  while (parent && tree.toValue(parent) !== stop && !path.includes(parent)) {
    path.unshift(parent);
    parent = tree.items.get(parent.parent ?? '');
  }
  return path;
}

/** Collect visible descendants once, even if malformed data contains a cycle. */
export function commandDescendants<T extends CommandItem>(tree: CommandTree<T>, page: string): T[] {
  const seen = new Set<T>();
  /** Visit each child page without revisiting cycles. */
  function visit(children: readonly T[] | undefined): void {
    for (const item of children ?? []) {
      if (seen.has(item)) continue;
      seen.add(item);
      visit(tree.children.get(tree.toValue(item)));
    }
  }
  visit(tree.children.get(page));
  return [...seen];
}

/** Drop navigation steps after a revisited page or append a new page. */
export function updateCommandHistory(
  history: readonly (string | null)[],
  from: string | null,
  to: string | null,
  push: boolean,
): Array<string | null> {
  const visited = history.lastIndexOf(to);
  if (visited >= 0) return history.slice(0, visited);
  return push ? [...history, from] : [...history];
}
