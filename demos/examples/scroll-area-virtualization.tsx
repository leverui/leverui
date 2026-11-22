import { createVirtualizer } from './create-virtualizer';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, ScrollArea } from '../../src';
import './scroll-area-advanced.css';

const itemCount = 1000;

/** Mount only the visible rows in a thousand-item ScrollArea. */
export function ScrollAreaVirtualization(): JSX.Element {
  let viewport: HTMLDivElement | undefined;

  /** Expose the native viewport to the virtualizer. */
  function getScrollElement(): HTMLDivElement | null {
    return viewport ?? null;
  }

  /** Match the estimated row size. */
  function estimateSize(): number {
    return 80;
  }

  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: itemCount,
    getScrollElement,
    estimateSize,
    overscan: 5,
    initialRect: { width: 512, height: 320 },
  });

  /** Capture the same viewport used by the styled ScrollArea. */
  function captureViewport(element: HTMLDivElement): void {
    viewport = element;
  }

  return (
    <ScrollArea.Root class="scroll-area-example-virtual-root">
      <ScrollArea.Viewport ref={captureViewport}>
        <ScrollArea.Content>
          <Box
            class="scroll-area-example-virtual-content"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            <For each={virtualizer.getVirtualItems()}>
              {
                /** Place one visible row at its full-list offset. */
                (item) => (
                  <div
                    class="scroll-area-example-virtual-row"
                    style={{
                      height: `${item.size}px`,
                      transform: `translateY(${item.start}px)`,
                    }}
                  >
                    <div class="scroll-area-example-tile scroll-area-example-virtual-tile">
                      Item {item.index + 1}
                    </div>
                  </div>
                )
              }
            </For>
          </Box>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar class="scroll-area-example-transparent-track" />
    </ScrollArea.Root>
  );
}
