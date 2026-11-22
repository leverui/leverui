import { createRoot, createSignal, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { useCommandCollection } from './use-command-collection';

const commands = [
  { value: 'status', label: 'Change status' },
  { value: 'done', label: 'Done', parent: 'status' },
  { value: 'settings', label: 'Open settings', keywords: ['preferences'] },
];

/** Exercise search and nested pages through one mounted Solid owner. */
function verifiesReactivePages(): void {
  const owner = createRoot(
    /** Return the reactive collection and its cleanup action. */
    (dispose) => ({ command: useCommandCollection({ initialItems: commands }), dispose }),
  );
  try {
    expect(
      owner.command().collection.items.map(
        /** Read item values without depending on the collection's DOM. */
        (item) => item.value,
      ),
    ).toEqual(['status', 'settings']);
    owner.command().search('status');
    flush();
    expect(
      owner.command().collection.items.map(
        /** Only the matching root page remains after search. */
        (item) => item.value,
      ),
    ).toEqual(['status']);
    owner.command().setPage('status');
    flush();
    expect(owner.command().query).toBe('');
    expect(
      owner.command().collection.items.map(
        /** The child page shows its own commands. */
        (item) => item.value,
      ),
    ).toEqual(['done']);
    expect(owner.command().popPage()).toBe(true);
    flush();
    expect(owner.command().query).toBe('status');
    expect(owner.command().highlightedValue).toBe('status');
  } finally {
    owner.dispose();
  }
}

/** Keep controlled search and deferred ranking distinct. */
function verifiesControlledQuery(): void {
  const owner = createRoot(
    /** Expose a caller-owned query signal to the collection. */
    (dispose) => {
      const [query, setQuery] = createSignal('');
      const command = useCommandCollection(
        /** Follow query and filterQuery independently. */
        () => ({
          initialItems: commands,
          query: query(),
          filterQuery: '',
          onQueryChange: setQuery,
        }),
      );
      return { command, dispose };
    },
  );
  try {
    owner.command().search('preferences');
    flush();
    expect(owner.command().query).toBe('preferences');
    expect(owner.command().collection.items).toHaveLength(2);
    expect(owner.command().getFirstMatch('preferences')?.value).toBe('settings');
  } finally {
    owner.dispose();
  }
}

describe('useCommandCollection' /** Verify Solid state transitions before wiring the collection to the primitive. */, () => {
  it('searches and restores nested page state', verifiesReactivePages);
  it('accepts a controlled query with deferred filtering', verifiesControlledQuery);
});
