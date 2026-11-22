import { createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import type { CommandLoadResult } from './command-collection-async';
import { useCommandCollection } from './use-command-collection';

interface Item {
  value: string;
  label: string;
}

/** Verify remote pages append without filtering away server-selected results. */
async function verifiesPagination(): Promise<void> {
  const owner = createRoot(
    /** Create one collection owner with a cursor-bearing data source. */
    (dispose) => ({
      command: useCommandCollection<Item>({
        initialItems: [],
        filter: null,
        load:
          /** Supply two pages that represent a remote search response. */
          async ({ cursor }) =>
            cursor
              ? { items: [{ value: 'second', label: 'Second' }] }
              : { items: [{ value: 'first', label: 'First' }], cursor: 'next' },
      }),
      dispose,
    }),
  );
  try {
    await vi.waitFor(
      /** Wait for the first remote page to become visible. */
      () => expect(owner.command().collection.items).toHaveLength(1),
    );
    expect(owner.command().hasMore).toBe(true);
    owner.command().loadMore();
    await vi.waitFor(
      /** Wait for the cursor page to append to the collection. */
      () => expect(owner.command().collection.items).toHaveLength(2),
    );
    expect(owner.command().hasMore).toBe(false);
    expect(owner.command().collection.items[1]?.value).toBe('second');
  } finally {
    owner.dispose();
  }
}

/** Prevent an older search response from replacing newer results. */
async function verifiesCancellation(): Promise<void> {
  const pending = new Map<string, (result: CommandLoadResult<Item>) => void>();
  const owner = createRoot(
    /** Retain request resolvers so responses can complete out of order. */
    (dispose) => ({
      command: useCommandCollection<Item>({
        initialItems: [],
        load:
          /** Hold each request until the test resolves it. */
          ({ query }) =>
            new Promise<CommandLoadResult<Item>>(
              /** Save the resolver under its visible query. */
              (resolve) => pending.set(query, resolve),
            ),
      }),
      dispose,
    }),
  );
  try {
    await vi.waitFor(
      /** Wait for the initial query request. */
      () => expect(pending.has('')).toBe(true),
    );
    owner.command().search('fresh');
    await vi.waitFor(
      /** Wait for the replacement query request. */
      () => expect(pending.has('fresh')).toBe(true),
    );
    pending.get('fresh')?.([{ value: 'fresh', label: 'Fresh result' }]);
    await vi.waitFor(
      /** Confirm the current query owns the visible result. */
      () => expect(owner.command().collection.items[0]?.value).toBe('fresh'),
    );
    pending.get('')?.([{ value: 'stale', label: 'Stale result' }]);
    await Promise.resolve();
    expect(owner.command().collection.items[0]?.value).toBe('fresh');
  } finally {
    owner.dispose();
  }
}

describe('Command remote results' /** Exercise cursor paging and stale request ownership. */, () => {
  it('appends a remote cursor page', verifiesPagination);
  it('ignores a superseded search response', verifiesCancellation);
});
