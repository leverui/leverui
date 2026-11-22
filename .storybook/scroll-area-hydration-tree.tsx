import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { ScrollArea as AreaExport } from '../src';

export type ScrollAreaHydrationComponents = {
  ScrollArea: typeof AreaExport;
};

const rows = Array.from(
  { length: 20 },
  /** Keep the server and browser rows in the same stable order. */
  (_, index) => `Hydrated row ${index + 1}`,
);

/** Share one scrollable tree across the published server and browser builds. */
export function renderScrollAreaHydrationTree({
  ScrollArea,
}: ScrollAreaHydrationComponents): JSX.Element {
  return (
    <>
      <ScrollArea.Root
        id="hydrated-scroll-area"
        style={{ width: '20rem', height: '9rem' }}
        variant="always"
      >
        <ScrollArea.Viewport data-testid="hydrated-scroll-viewport">
          <ScrollArea.Content>
            <For each={rows}>
              {/** Preserve item identity while the browser hydrates the viewport. */}
              {(row) => <p>{row}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar data-testid="hydrated-scrollbar" />
      </ScrollArea.Root>
    </>
  );
}
