import { createVirtualizer, type Virtualizer } from '../demos/examples/create-virtualizer';
import { For, onCleanup } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Listbox as ListboxExport,
  ListboxScrollToIndexDetails,
  createListCollection as CollectionExport,
} from '../src';
import { countries, virtualizedListboxConfig } from '../demos/listbox-virtualized-data';

export interface VirtualizedListboxComponents {
  Listbox: typeof ListboxExport;
  createListCollection: typeof CollectionExport;
}

interface ListboxVirtualizer {
  virtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>;
  setScrollElement: (element: HTMLDivElement) => void;
  scrollToIndex: (details: ListboxScrollToIndexDetails) => void;
}

/** Coordinate TanStack's DOM window with Zag's offscreen keyboard target. */
function createListboxVirtualizer(initialOffset: number): ListboxVirtualizer {
  let scrollElement: HTMLDivElement | undefined;
  let pendingScroll: ReturnType<typeof setTimeout> | undefined;
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: countries.length,
    /** Read the content element after Solid assigns its ref. */
    getScrollElement: () => scrollElement ?? null,
    /** Match the guide's fixed item estimate. */
    estimateSize: () => virtualizedListboxConfig.rowHeight,
    overscan: virtualizedListboxConfig.overscan,
    initialRect: {
      width: virtualizedListboxConfig.viewportWidth,
      height: virtualizedListboxConfig.viewportHeight,
    },
    initialOffset,
  });

  /** Cancel an obsolete keyboard jump or a pending unmount callback. */
  function clearPendingScroll(): void {
    if (pendingScroll !== undefined) clearTimeout(pendingScroll);
    pendingScroll = undefined;
  }

  /** Retry after the virtual window moves until Zag's target is mounted. */
  function scrollToIndex(details: ListboxScrollToIndexDetails): void {
    clearPendingScroll();
    if (details.index < 0 || details.index >= countries.length) return;

    /** Align the rendered target, or move the window toward it. */
    function alignTarget(): void {
      const rendered = virtualizer.getVirtualItems().some(
        /** Compare the requested collection index with the rendered rows. */
        (item) => item.index === details.index,
      );
      const element = rendered ? details.getElement() : null;
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
        clearPendingScroll();
        return;
      }
      virtualizer.scrollToIndex(details.index);
      if (!details.immediate) pendingScroll = setTimeout(alignTarget, 16);
    }

    alignTarget();
  }

  /** Supply the scroll viewport to TanStack after Solid creates it. */
  function setScrollElement(element: HTMLDivElement): void {
    scrollElement = element;
  }

  onCleanup(clearPendingScroll);
  return { virtualizer, setScrollElement, scrollToIndex };
}

/** Render the country guide through Lever UI's Solid Listbox parts. */
export function renderVirtualizedListbox(
  components: VirtualizedListboxComponents,
  initialOffset = 0,
): JSX.Element {
  const { Listbox } = components;
  const collection = components.createListCollection({ items: countries });
  const { virtualizer, setScrollElement, scrollToIndex } = createListboxVirtualizer(initialOffset);

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
          collection={collection}
          scrollToIndexFn={scrollToIndex}
        >
          <Listbox.Label>Select Country ({countries.length} items)</Listbox.Label>
          <Listbox.Content>
            <Listbox.List
              ref={setScrollElement}
              data-testid="virtual-listbox-content"
              style={{
                'max-height': `${virtualizedListboxConfig.viewportHeight}px`,
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                  'flex-shrink': '0',
                }}
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
                          style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                            'white-space': 'nowrap',
                            overflow: 'hidden',
                            'text-overflow': 'ellipsis',
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
      </div>
    </>
  );
}
