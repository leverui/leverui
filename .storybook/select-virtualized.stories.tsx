import { createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal, Select } from '../src';

const rowHeight = 28;
const visibleCount = 8;
const items = Array.from(
  { length: 100 },
  /** Give each virtual option a stable value in the full collection. */
  (_, index) => ({ label: `Country ${index + 1}`, value: `country-${index + 1}` }),
);
const collection = Select.createListCollection({ items });

/** Render a small popup window while Zag knows every collection option. */
function VirtualizedExample(): JSX.Element {
  const [start, setStart] = createSignal(0);
  const [requestedIndex, setRequestedIndex] = createSignal(-1);
  const visible = createMemo(
    /** Keep only the current popup window mounted. */
    () => items.slice(start(), start() + visibleCount),
  );
  let content: HTMLDivElement | undefined;

  /** Follow pointer or wheel scrolling through the full collection space. */
  function handleScroll(event: Event & { currentTarget: HTMLDivElement }): void {
    setStart(
      Math.min(items.length - visibleCount, Math.floor(event.currentTarget.scrollTop / rowHeight)),
    );
  }

  /** Reveal an offscreen machine target when Zag requests its index. */
  function scrollToIndex(details: { index: number }): void {
    setRequestedIndex(details.index);
    setStart(Math.min(items.length - visibleCount, Math.max(0, details.index - 2)));
    if (content) content.scrollTop = details.index * rowHeight;
  }

  return (
    <>
      <div style={{ width: '320px', padding: '24px' }}>
        <Select.Root collection={collection} scrollToIndexFn={scrollToIndex} size="sm">
          <Select.HiddenSelect />
          <Select.Label>Country</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="virtual-select-trigger">
              <Select.ValueText placeholder="Choose a country" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List
                  ref={
                    /** Retain the current popup scroll viewport. */
                    (element: HTMLDivElement) => {
                      content = element;
                    }
                  }
                  onScroll={handleScroll}
                  data-testid="virtual-select-content"
                  style={{ height: '160px', overflow: 'auto' }}
                >
                  <div style={{ height: `${items.length * rowHeight}px`, position: 'relative' }}>
                    <For each={visible()}>
                      {
                        /** Place each mounted option at its full collection index. */
                        (item, localIndex) => (
                          <Select.Item
                            item={item}
                            aria-posinset={start() + localIndex() + 1}
                            aria-setsize={items.length}
                            style={{
                              position: 'absolute',
                              top: `${(start() + localIndex()) * rowHeight}px`,
                              height: `${rowHeight}px`,
                              width: '100%',
                            }}
                          >
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        )
                      }
                    </For>
                  </div>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <output data-testid="virtual-select-scroll-index">{requestedIndex()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Select Virtualized',
  component: VirtualizedExample,
} satisfies Meta<typeof VirtualizedExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: VirtualizedExample };
