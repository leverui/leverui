import {
  rankCommandItems,
  restoreCommandGroupOrder,
  type CommandRankOptions,
} from './command-ranking';
import type { CommandItem } from './command-types';

/** Merge locally ranked commands with remote results in stable group order. */
export function buildCommandResults<T extends CommandItem>(
  local: readonly T[],
  remote: readonly T[],
  query: string,
  options: CommandRankOptions<T>,
): T[] {
  const localRanked = rankCommandItems(local, query, { ...options, limit: undefined });
  const remoteRanked = options.filter
    ? rankCommandItems(remote, query, { filter: options.filter })
    : [...remote];
  const combined = [...localRanked, ...remoteRanked];
  const grouped = options.groupBy
    ? restoreCommandGroupOrder(combined, [...local, ...remote], options.groupBy)
    : combined;
  return options.limit === undefined ? grouped : grouped.slice(0, Math.max(0, options.limit));
}
