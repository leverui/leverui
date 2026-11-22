import { splitProps } from '../../utils/split-props';
import { createMemo, createSignal } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { createListCollection } from './list-collection';
import type { UseListCollectionProps, UseListCollectionReturn } from './use-list-collection-types';
export type { UseListCollectionProps, UseListCollectionReturn } from './use-list-collection-types';

/** Create the list collection state and return its API. */
export function useListCollection<T>(
  props: MaybeAccessor<UseListCollectionProps<T>>,
): UseListCollectionReturn<T> {
  const splittedProps = createMemo(() => {
    const rawProps = typeof props === 'function' ? props() : props;
    return splitProps(rawProps, ['initialItems', 'filter', 'limit']);
  });

  /** Init. */
  const init = () => {
    const [localProps] = splittedProps();
    return localProps.initialItems;
  };

  const [items, setItemsImpl] = createSignal<T[] | readonly T[]>(init());
  const [filterText, setFilterText] = createSignal('');

  /** Set the items. */
  const setItems = (newItems: T[] | readonly T[]) => {
    setItemsImpl(newItems);
    setFilterText('');
  };

  /** Create a collection of the given items with the hook's options. */
  const create = (itemsToCreate: T[] | readonly T[]) => {
    const [, collectionOptions] = splittedProps();
    return createListCollection({ ...collectionOptions, items: itemsToCreate });
  };

  const collection = createMemo(() => {
    const [localProps, collectionOptions] = splittedProps();
    const filter = localProps.filter;

    let activeItems = items();

    // Apply filter if we have filter text and a filter function
    if (filterText() && filter) {
      activeItems = create(items()).filter((itemString, _index, item) =>
        filter(itemString, filterText(), item),
      ).items;
    }

    // Apply limit
    const limitedItems =
      localProps.limit == null ? activeItems : activeItems.slice(0, localProps.limit);
    return createListCollection({ ...collectionOptions, items: limitedItems });
  });

  return {
    collection,
    /** Filter the items by the input text. */
    filter: (inputValue = '') => {
      setFilterText(inputValue);
    },
    /** Replace the items and clear the filter. */
    set: (newItems) => {
      setItems(newItems);
    },
    /** Restore the initial items. */
    reset: () => {
      const [localProps] = splittedProps();
      setItems(localProps.initialItems);
    },
    /** Clear. */
    clear: () => {
      setItems([]);
    },
    /** Insert. */
    insert: (index, ...itemsToInsert) => {
      const newItems = create(items()).insert(index, ...itemsToInsert).items;
      setItems(newItems);
    },
    /** Insert before. */
    insertBefore: (value, ...itemsToInsert) => {
      const newItems = create(items()).insertBefore(value, ...itemsToInsert).items;
      setItems(newItems);
    },
    /** Insert after. */
    insertAfter: (value, ...itemsToInsert) => {
      const newItems = create(items()).insertAfter(value, ...itemsToInsert).items;
      setItems(newItems);
    },
    /** Remove. */
    remove: (...itemOrValues) => {
      const newItems = create(items()).remove(...itemOrValues).items;
      setItems(newItems);
    },
    /** Move. */
    move: (value, to) => {
      const newItems = create(items()).move(value, to).items;
      setItems(newItems);
    },
    /** Move before. */
    moveBefore: (value, ...values) => {
      const newItems = create(items()).moveBefore(value, ...values).items;
      setItems(newItems);
    },
    /** Move after. */
    moveAfter: (value, ...values) => {
      const newItems = create(items()).moveAfter(value, ...values).items;
      setItems(newItems);
    },
    /** Reorder. */
    reorder: (from: number, to: number) => {
      const newItems = create(items()).reorder(from, to).items;
      setItems(newItems);
    },
    /** Append. */
    append: (...itemsToAppend) => {
      const newItems = create(items()).append(...itemsToAppend).items;
      setItems(newItems);
    },
    /** Upsert. */
    upsert: (value, item, mode = 'append') => {
      const newItems = create(items()).upsert(value, item, mode).items;
      setItems(newItems);
    },
    /** Prepend. */
    prepend: (...itemsToPrepend) => {
      const newItems = create(items()).prepend(...itemsToPrepend).items;
      setItems(newItems);
    },
    /** Update. */
    update: (value, item) => {
      const newItems = create(items()).update(value, item).items;
      setItems(newItems);
    },
  };
}
