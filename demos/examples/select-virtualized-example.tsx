import { createSignal, For, onCleanup, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createVirtualizer } from './create-virtualizer';
import { Select } from '../../src';
import { countries1 } from './select-virtual-countries-1';
import { countries2 } from './select-virtual-countries-2';
import { countries3 } from './select-virtual-countries-3';
import { countries4 } from './select-virtual-countries-4';

const items = [...countries1, ...countries2, ...countries3, ...countries4];
const collection = Select.createListCollection({ items });

/** Virtualize the full 249-country Select collection. */
export function SelectVirtualized(): JSX.Element {
  const [content, setContent] = createSignal<HTMLDivElement>();
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  const virtualizer = createVirtualizer({
    count: items.length,
    getScrollElement:
      /** Track the actual Select popup as the scroll viewport. */
      () => content() ?? null,
    estimateSize:
      /** Match the 28-pixel option estimate. */
      () => 28,
    overscan: 10,
    scrollPaddingEnd: 32,
  });

  /** Hand the current popup node to the virtualizer. */
  function captureContent(node: HTMLDivElement): void {
    setContent(node);
  }

  /** Reveal an offscreen highlighted option after the popup settles. */
  function scrollToIndex(details: { index: number }): void {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(
      /** Wait for the current option window before scrolling to its target. */
      () =>
        requestAnimationFrame(
          /** Align the highlighted option at the end of the viewport. */
          () => virtualizer.scrollToIndex(details.index, { align: 'end', behavior: 'auto' }),
        ),
      50,
    );
  }

  onCleanup(
    /** Do not leave a delayed scroll after the story unmounts. */
    () => {
      if (scrollTimer) clearTimeout(scrollTimer);
    },
  );

  return (
    <Select.Root
      style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
      size="sm"
      collection={collection}
      scrollToIndexFn={scrollToIndex}
    >
      <Select.Label>Country</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select a country" />
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.List ref={captureContent}>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              <For each={virtualizer.getVirtualItems()}>
                {
                  /** Mount only visible countries at their measured positions. */
                  (virtualItem) => (
                    <Show when={items[virtualItem.index]}>
                      {
                        /** Keep the real collection item attached to its virtual row. */
                        (item) => (
                          <Select.Item
                            item={item()}
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
                            <Select.ItemText>{item().label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        )
                      }
                    </Show>
                  )
                }
              </For>
            </div>
          </Select.List>
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  );
}
