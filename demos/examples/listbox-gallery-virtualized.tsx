import { createVirtualizer } from './create-virtualizer';
import { For, onCleanup } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Listbox, createListCollection, type ListboxScrollToIndexDetails } from '../../src';
import { countries } from '../listbox-virtualized-data';
import './listbox-examples.css';

/** Coordinate the virtual window with the Listbox's offscreen keyboard target. */
function createListboxVirtualizer(count: number) {
  let scrollElement: HTMLDivElement | undefined;
  let pendingScroll: ReturnType<typeof setTimeout> | undefined;
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count,
    /** Read the content element after Solid assigns its ref. */
    getScrollElement: () => scrollElement ?? null,
    /** Size every row from the same estimate. */
    estimateSize: () => 32,
    overscan: 10,
  });

  /** Cancel an obsolete keyboard jump. */
  function clearPendingScroll(): void {
    if (pendingScroll !== undefined) clearTimeout(pendingScroll);
    pendingScroll = undefined;
  }

  /** Move the virtual window until the keyboard target is rendered. */
  function scrollToIndexFn(details: ListboxScrollToIndexDetails): void {
    clearPendingScroll();

    /** Align the rendered target, or scroll toward it and try again. */
    function alignTarget(): void {
      const rendered = virtualizer.getVirtualItems().some(
        /** Compare the requested collection index with the rendered rows. */
        (item) => item.index === details.index,
      );
      if (rendered) {
        details.getElement()?.scrollIntoView({ block: 'nearest' });
        clearPendingScroll();
        return;
      }
      virtualizer.scrollToIndex(details.index);
      if (!details.immediate) pendingScroll = setTimeout(alignTarget, 16);
    }

    alignTarget();
  }

  /** Supply the scroll viewport after Solid creates it. */
  function setScrollElement(element: HTMLDivElement): void {
    scrollElement = element;
  }

  onCleanup(clearPendingScroll);
  return { virtualizer, setScrollElement, scrollToIndexFn };
}

/** Render a bounded DOM window over the full country collection. */
export function ListboxVirtualized(): JSX.Element {
  const collection = createListCollection({ items: countries });
  const { virtualizer, setScrollElement, scrollToIndexFn } = createListboxVirtualizer(
    countries.length,
  );

  return (
    <Listbox.Root
      collection={collection}
      scrollToIndexFn={scrollToIndexFn}
      style={{ 'max-width': 'var(--lui-sizes-sm)' }}
    >
      <Listbox.Label>Select country ({countries.length} items)</Listbox.Label>
      <Listbox.Content class="example-listbox-virtual-content">
        <Listbox.List ref={setScrollElement}>
          <div
            class="example-listbox-virtual-spacer"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            <For each={virtualizer.getVirtualItems()}>
              {
                /** Position each mounted option at its full-collection offset. */
                (virtualItem) => {
                  const country = countries[virtualItem.index];
                  if (!country) return null;
                  return (
                    <Listbox.Item
                      item={country}
                      aria-posinset={virtualItem.index + 1}
                      aria-setsize={countries.length}
                      class="example-listbox-virtual-item"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <Listbox.ItemText>{country.label}</Listbox.ItemText>
                      <Listbox.ItemIndicator />
                    </Listbox.Item>
                  );
                }
              }
            </For>
          </div>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}
