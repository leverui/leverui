import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ScrollArea, Stack, Text, useScrollArea } from '../../src';
import { ExampleParagraphs } from './example-paragraphs';
import './scroll-area-surfaces.css';

/** Provide an explicit scroll store to the same surface. */
export function ScrollAreaWithStore(): JSX.Element {
  const scrollArea = useScrollArea();
  return (
    <ScrollArea.RootProvider value={scrollArea} class="scroll-area-example-store">
      <ScrollArea.Viewport>
        <ScrollArea.Content class="scroll-area-example-copy">
          <ExampleParagraphs paragraphs={3} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.RootProvider>
  );
}

/** Color the always-visible track and thumb red. */
export function ScrollAreaWithThumbStyling(): JSX.Element {
  return (
    <ScrollArea.Root class="scroll-area-example-thumb-root" variant="always">
      <ScrollArea.Viewport>
        <ScrollArea.Content class="scroll-area-example-copy scroll-area-example-thumb-copy">
          <ExampleParagraphs paragraphs={2} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar class="scroll-area-example-red-track">
        <ScrollArea.Thumb class="scroll-area-example-red-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

/** Compare hover and always-visible scrollbar variants. */
export function ScrollAreaWithVariants(): JSX.Element {
  return (
    <Stack gap="8" class="scroll-area-example-stack">
      <For each={['hover', 'always'] as const}>
        {(variant) => (
          <Stack gap="2">
            <Text class="scroll-area-example-label">variant="{variant}"</Text>
            <ScrollArea.Root class="scroll-area-example-size" variant={variant}>
              <ScrollArea.Viewport>
                <ScrollArea.Content class="scroll-area-example-copy">
                  <ExampleParagraphs paragraphs={4} />
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar />
            </ScrollArea.Root>
          </Stack>
        )}
      </For>
    </Stack>
  );
}
