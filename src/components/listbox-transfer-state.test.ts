import { createRoot, flush } from 'solid-js';
import { expect, test } from 'vitest';
import { createListCollection } from '../../src';
import { createTransferListState } from '../../.storybook/listbox-transfer-state';

/** Verify bidirectional moves retain item order and clear stale selections. */
function verifiesTransferState(): void {
  const { state, preset, dispose } = createRoot(
    /** Own both transfer states until the assertions complete. */
    (dispose) => ({
      state: createTransferListState(createListCollection),
      preset: createTransferListState(createListCollection, ['wren']),
      dispose,
    }),
  );
  // Solid 2 rejects writes inside an owner's body, so selections change outside the root.
  expect(
    preset.selectedSource().map(
      /** Confirm an initial selection resolves through the source collection. */
      (item) => item.value,
    ),
  ).toEqual(['wren']);
  const corin = state.source().find('corin');
  const wren = state.source().find('wren');
  expect(corin).not.toBeNull();
  expect(wren).not.toBeNull();
  if (!corin || !wren) throw new Error('Transfer fixture items are missing');

  state.setSelectedSource([wren, corin]);
  flush();
  expect(state.moveToTarget()).toBe(corin);
  flush();
  expect(state.source().getValues()).not.toContain('wren');
  expect(state.source().getValues()).not.toContain('corin');
  expect(state.target().getValues()).toEqual(['wren', 'corin']);
  expect(state.selectedSource()).toEqual([]);
  expect(state.moveToTarget()).toBeUndefined();

  state.setSelectedTarget([wren, corin]);
  flush();
  expect(state.moveToSource()).toBe(corin);
  flush();
  expect(state.target().getValues()).toEqual([]);
  expect(state.source().getValues().slice(-2)).toEqual(['wren', 'corin']);
  expect(state.selectedTarget()).toEqual([]);
  dispose();
}

test('Listbox transfer state moves selected items both ways', verifiesTransferState);
