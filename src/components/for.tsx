import { createMemo, For as SolidFor, Show, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

interface PresentItems<T> {
  items: T[];
  positions: number[];
}

/** Skip array holes while retaining each present item's original position. */
function collectPresentItems<T>(each: readonly T[] | undefined): PresentItems<T> {
  const items: T[] = [];
  const positions: number[] = [];
  if (!each) return { items, positions };

  each.forEach(
    /** Collect one present slot with its original array position. */
    (item, index) => {
      items.push(item);
      positions.push(index);
    },
  );
  return { items, positions };
}

export interface ForProps<T> {
  /** Items to render; an empty list shows the fallback, while absence renders nothing. */
  each: readonly T[] | undefined;
  /** Content shown only when the array is empty. */
  fallback?: JSX.Element | undefined;
  /** Render one item with a reactive index accessor. */
  children: (item: T, index: Accessor<number>) => JSX.Element;
}

/** Render a keyed Solid list without adding a DOM wrapper. */
export function For<T>(props: ForProps<T>): JSX.Element {
  const present = createMemo(
    /** Rebuild the dense view when the input array changes. */
    () => collectPresentItems(props.each),
  );

  /** Mount keyed items for one item-renderer identity. */
  function renderItems(renderer: ForProps<T>['children']): JSX.Element {
    /** Pass a present item's original position to the current renderer. */
    function renderItem(item: T, denseIndex: Accessor<number>): JSX.Element {
      /** Track the current position of this item in the original array. */
      function originalIndex(): number {
        const position = present().positions[denseIndex()];
        if (position === undefined) throw new Error('For index is unavailable for a mounted item.');
        return position;
      }

      return renderer(item, originalIndex);
    }

    /* Track present items after sparse holes have been skipped. */
    return <SolidFor each={present().items}>{renderItem}</SolidFor>;
  }

  return (
    <Show
      when={props.each?.length}
      fallback={props.each === undefined ? null : props.fallback || null}
    >
      <Show when={props.children} keyed>
        {renderItems}
      </Show>
    </Show>
  );
}
