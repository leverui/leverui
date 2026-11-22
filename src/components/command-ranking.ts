import { createCommandMatcher, prepareCommand, type PreparedCommand } from './command-fuzzy-score';
import type { CommandItem } from './command-types';

/** Search policy and collection adapters used for a Command result list. */
export interface CommandRankOptions<T extends CommandItem> {
  /** Convert an item to its searchable label. */
  itemToString?: ((item: T) => string) | undefined;
  /** Assign items to stable groups. */
  groupBy?: ((item: T, index: number) => string) | undefined;
  /** Override fuzzy scoring; null preserves the given source order. */
  filter?: ((item: T, query: string) => number) | null | undefined;
  limit?: number | undefined;
  prepared?: WeakMap<T, PreparedCommand> | undefined;
}

interface RankedItem<T> {
  readonly item: T;
  readonly index: number;
  readonly score: number;
}

/** Keep group order from the source while preserving ranking within each group. */
export function restoreCommandGroupOrder<T extends CommandItem>(
  ranked: readonly T[],
  source: readonly T[],
  groupBy: (item: T, index: number) => string,
): T[] {
  const groupOrder = new Map<string, number>();
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index];
    if (!item) continue;
    const group = groupBy(item, index);
    if (!groupOrder.has(group)) groupOrder.set(group, groupOrder.size);
  }
  const byGroup: Array<{ item: T; index: number; order: number }> = [];
  for (let index = 0; index < ranked.length; index += 1) {
    const item = ranked[index];
    if (!item) continue;
    byGroup.push({ item, index, order: groupOrder.get(groupBy(item, index)) ?? 0 });
  }
  byGroup.sort(
    /** Preserve the prior score order among items in one group. */
    (left, right) => left.order - right.order || left.index - right.index,
  );
  return byGroup.map(
    /** Return the original caller-owned items after ranking. */
    (entry) => entry.item,
  );
}

/** Rank local items by fuzzy score, with stable ties and source group order. */
export function rankCommandItems<T extends CommandItem>(
  source: readonly T[],
  query: string,
  options: CommandRankOptions<T> = {},
): T[] {
  const { itemToString, groupBy, filter, limit, prepared } = options;
  let ranked: T[];
  if (!query || filter === null) {
    ranked = [...source];
  } else {
    const matcher = createCommandMatcher(query);
    const scored: RankedItem<T>[] = [];
    for (let index = 0; index < source.length; index += 1) {
      const item = source[index];
      if (!item) continue;
      let score: number;
      if (filter) score = filter(item, query);
      else {
        let text = prepared?.get(item);
        if (!text) {
          text = prepareCommand(itemToString?.(item) ?? item.label ?? '', item.keywords);
          prepared?.set(item, text);
        }
        score = matcher(text);
      }
      if (score > 0) scored.push({ item, index, score });
    }
    scored.sort(
      /** Keep source order for equally ranked commands. */
      (left, right) => right.score - left.score || left.index - right.index,
    );
    ranked = scored.map(
      /** Return caller items without leaking score metadata. */
      (entry) => entry.item,
    );
  }
  if (groupBy) ranked = restoreCommandGroupOrder(ranked, source, groupBy);
  return limit === undefined ? ranked : ranked.slice(0, Math.max(0, limit));
}
