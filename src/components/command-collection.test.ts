import { describe, expect, it } from 'vitest';
import {
  buildCommandTree,
  commandAncestors,
  commandDescendants,
  COMMAND_ROOT_PAGE,
  updateCommandHistory,
} from './command-collection-tree';
import { rankCommandItems } from './command-ranking';

interface Item {
  value: string;
  label: string;
  group?: string;
  parent?: string;
}

const items: Item[] = [
  { value: 'status', label: 'Change status' },
  { value: 'done', label: 'Done', parent: 'status' },
  { value: 'settings', label: 'Settings' },
];

/** Read the stable value used by collection and test assertions. */
function itemValue(item: Item): string {
  return item.value;
}

/** Verify page relationships and navigation history without a mounted UI. */
function verifiesPages(): void {
  const tree = buildCommandTree(items, itemValue);
  expect(commandDescendants(tree, COMMAND_ROOT_PAGE).map(itemValue)).toEqual([
    'status',
    'done',
    'settings',
  ]);
  const done = items[1];
  if (!done) throw new Error('The nested Command fixture is missing.');
  expect(commandAncestors(tree, done)).toEqual([items[0]]);
  expect(updateCommandHistory([null, 'status'], 'done', 'status', true)).toEqual([null]);
}

/** Preserve group order while ranking matches within each source group. */
function verifiesRanking(): void {
  const source: Item[] = [
    { value: 'app-search', label: 'App search', group: 'App' },
    { value: 'search', label: 'Search', group: 'Actions' },
    { value: 'settings', label: 'Settings', group: 'App' },
  ];
  /** Read a result's source group. */
  function groupBy(item: Item): string {
    return item.group ?? '';
  }
  expect(rankCommandItems(source, 'search').map(itemValue)).toEqual(['search', 'app-search']);
  expect(rankCommandItems(source, 'search', { groupBy }).map(itemValue)).toEqual([
    'app-search',
    'search',
  ]);
  expect(rankCommandItems(source, 'missing', { filter: null, limit: 2 })).toEqual(
    source.slice(0, 2),
  );
}

describe('Command collection policies' /** Keep page and ranking rules independently testable from the UI. */, () => {
  it('tracks nested pages and history', verifiesPages);
  it('ranks matches within stable groups', verifiesRanking);
});
