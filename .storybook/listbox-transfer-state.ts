import { createSignal, untrack } from 'solid-js';
import type { createListCollection } from '../src';

export type TransferItem = { label: string; value: string };

const initialItems: TransferItem[] = [
  { label: 'Wren', value: 'wren' },
  { label: 'Corin', value: 'corin' },
  { label: 'Mira', value: 'mira' },
  { label: 'Tobin', value: 'tobin' },
  { label: 'Ansel', value: 'ansel' },
  { label: 'Juniper', value: 'juniper' },
  { label: 'Calla', value: 'calla' },
  { label: 'Dorian', value: 'dorian' },
  { label: 'Elsie', value: 'elsie' },
  { label: 'Fenwick', value: 'fenwick' },
  { label: 'Greta', value: 'greta' },
  { label: 'Hollis', value: 'hollis' },
  { label: 'Isolde', value: 'isolde' },
  { label: 'Jasper', value: 'jasper' },
  { label: 'Linnea', value: 'linnea' },
];

/** Own the two collections and their independent controlled selections. */
export function createTransferListState(
  collectionFactory: typeof createListCollection,
  initialSelectedSource: readonly string[] = [],
) {
  const [source, setSource] = createSignal(collectionFactory({ items: initialItems }));
  const [target, setTarget] = createSignal(collectionFactory<TransferItem>({ items: [] }));
  // Read the initial collection untracked so the caller's render scope does
  // not subscribe to later collection changes.
  const [selectedSource, setSelectedSource] = createSignal<TransferItem[]>(
    untrack(source).findMany([...initialSelectedSource]),
  );
  const [selectedTarget, setSelectedTarget] = createSignal<TransferItem[]>([]);

  /** Move selected source items in their collection order and clear selection. */
  function moveToTarget(): TransferItem | undefined {
    const items = selectedSource();
    if (items.length === 0) return undefined;
    setSource(source().remove(...items));
    setTarget(target().append(...items));
    setSelectedSource([]);
    return items.at(-1);
  }

  /** Return selected target items and clear the target selection. */
  function moveToSource(): TransferItem | undefined {
    const items = selectedTarget();
    if (items.length === 0) return undefined;
    setSource(source().append(...items));
    setTarget(target().remove(...items));
    setSelectedTarget([]);
    return items.at(-1);
  }

  return {
    source,
    target,
    selectedSource,
    selectedTarget,
    setSelectedSource,
    setSelectedTarget,
    moveToTarget,
    moveToSource,
  };
}
