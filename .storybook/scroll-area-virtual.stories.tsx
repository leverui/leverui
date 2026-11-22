import { createVirtualizer } from '../demos/examples/create-virtualizer';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ScrollArea } from '../src';

const itemCount = 1000;
const rowHeight = 48;

/** Render a large collection while mounting only the visible rows. */
function VirtualArea(): JSX.Element {
  let viewport: HTMLDivElement | undefined;

  /** Return the native viewport after Solid assigns its ref. */
  function getScrollElement(): HTMLDivElement | null {
    return viewport ?? null;
  }

  /** Keep each virtual row at a predictable height. */
  function estimateSize(): number {
    return rowHeight;
  }

  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: itemCount,
    getScrollElement,
    estimateSize,
    overscan: 5,
    initialRect: { width: 320, height: 240 },
  });

  /** Give TanStack the same element that Zag measures and scrolls. */
  function captureViewport(element: HTMLDivElement): void {
    viewport = element;
  }

  /** Move the virtual window near the end of the collection. */
  function showLastItem(): void {
    virtualizer.scrollToIndex(itemCount - 1, { align: 'end' });
  }

  return (
    <>
      <button type="button" onClick={showLastItem}>
        Show last item
      </button>
      <ScrollArea.Root style={{ height: '15rem', width: '20rem' }} variant="always">
        <ScrollArea.Viewport ref={captureViewport} data-testid="virtual-viewport">
          <ScrollArea.Content>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              <For each={virtualizer.getVirtualItems()}>
                {/** Position mounted rows at their full-collection offset. */}
                {(item) => (
                  <div
                    data-testid="virtual-row"
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: `${item.size}px`,
                      transform: `translateY(${item.start}px)`,
                    }}
                  >
                    Item {item.index + 1}
                  </div>
                )}
              </For>
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </>
  );
}

const meta = {
  title: 'Components/Scroll Area Virtual',
  component: VirtualArea,
} satisfies Meta<typeof VirtualArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Virtualized: Story = { render: VirtualArea };
