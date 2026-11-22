import { splitProps } from '../../utils/split-props';
import { Selection } from '@zag-js/collection';
import { createEffect, createMemo, createSignal } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import type { CollectionItem } from './list-collection';
import type { UseListSelectionProps, UseListSelectionReturn } from './use-list-selection-types';
export type { UseListSelectionProps, UseListSelectionReturn } from './use-list-selection-types';

/** Create the list selection state and return its API. */
export function useListSelection<T extends CollectionItem>(
  props: MaybeAccessor<UseListSelectionProps<T>>,
): UseListSelectionReturn {
  const splittedProps = createMemo(() => {
    const rawProps = typeof props === 'function' ? props() : props;
    return splitProps(rawProps, [
      'collection',
      'selectionMode',
      'deselectable',
      'initialSelectedValues',
      'resetOnCollectionChange',
    ]);
  });

  /** Create a selection. */
  const createSelection = (values: string[] = []) => {
    const [localProps] = splittedProps();
    const selection = new Selection(values);
    selection.selectionMode = localProps.selectionMode ?? 'single';
    selection.deselectable = localProps.deselectable ?? true;
    return selection;
  };

  /** Init. */
  const init = () => {
    const [localProps] = splittedProps();
    return createSelection(localProps.initialSelectedValues ?? []);
  };

  const [selection, setSelection] = createSignal(init());

  /** Watch deps. */
  const watchDeps = () => {
    const [{ collection, resetOnCollectionChange }] = splittedProps();
    return [collection.getValues(), resetOnCollectionChange] as const;
  };

  createEffect(
    watchDeps,
    ([, resetOnCollectionChange]) => {
      if (resetOnCollectionChange) {
        setSelection(createSelection());
      }
    },
    { defer: true },
  );

  const selectedValues = createMemo(() => Array.from(selection()));

  const isEmpty = createMemo(() => selection().isEmpty());

  const firstSelectedValue = createMemo(() => {
    const [localProps] = splittedProps();
    return selection().firstSelectedValue(localProps.collection);
  });

  const lastSelectedValue = createMemo(() => {
    const [localProps] = splittedProps();
    return selection().lastSelectedValue(localProps.collection);
  });

  return {
    selectedValues,
    isEmpty,
    firstSelectedValue,
    lastSelectedValue,
    /** Whether selected. */
    isSelected: (value: string | null) => {
      return selection().isSelected(value);
    },
    /** Whether all selected. */
    isAllSelected: () => {
      const [localProps] = splittedProps();
      const allValues = localProps.collection.getValues();
      return allValues.length > 0 && allValues.every((value) => selection().isSelected(value));
    },
    /** Whether some selected. */
    isSomeSelected: () => {
      const [localProps] = splittedProps();
      const allValues = localProps.collection.getValues();
      return allValues.some((value) => selection().isSelected(value));
    },
    /** Can select. */
    canSelect: (value: string) => {
      const [localProps] = splittedProps();
      return selection().canSelect(localProps.collection, value);
    },
    /** Select. */
    select: (value: string, forceToggle?: boolean) => {
      const [localProps] = splittedProps();
      setSelection(selection().select(localProps.collection, value, forceToggle));
    },
    /** Deselect. */
    deselect: (value: string) => {
      setSelection(selection().deselect(value));
    },
    /** Toggle. */
    toggle: (value: string) => {
      const [localProps] = splittedProps();
      setSelection(selection().toggleSelection(localProps.collection, value));
    },
    /** Replace. */
    replace: (value: string | null) => {
      const [localProps] = splittedProps();
      setSelection(selection().replaceSelection(localProps.collection, value));
    },
    /** Extend. */
    extend: (anchorValue: string, targetValue: string) => {
      const [localProps] = splittedProps();
      setSelection(selection().extendSelection(localProps.collection, anchorValue, targetValue));
    },
    /** Set the selected values. */
    setSelectedValues: (values: string[]) => {
      setSelection(selection().setSelection(values));
    },
    /** Clear. */
    clear: () => {
      setSelection(selection().clearSelection());
    },
    /** Reset selection. */
    resetSelection: () => {
      setSelection(createSelection());
    },
  };
}
