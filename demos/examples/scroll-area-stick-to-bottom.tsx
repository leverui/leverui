import { createEffect, createSignal, onCleanup, Show, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Button, ButtonGroup, IconButton, ScrollArea, VStack } from '../../src';
import './scroll-area-advanced.css';

const initialMessages = [
  'Message 1 - 10:00:00',
  'Message 2 - 10:00:01',
  'Message 3 - 10:00:02',
  'Message 4 - 10:00:03',
  'Message 5 - 10:00:04',
  'Message 6 - 10:00:05',
  'Message 7 - 10:00:06',
  'Message 8 - 10:00:07',
  'Message 9 - 10:00:08',
  'Message 10 - 10:00:09',
];

/** Keep a chat-like ScrollArea anchored at the bottom while new items arrive. */
export function ScrollAreaStickToBottom(): JSX.Element {
  const [messages, setMessages] = createSignal(initialMessages);
  const [isAtBottom, setIsAtBottom] = createSignal(true);
  let viewport: HTMLDivElement | undefined;
  let frame: number | undefined;

  /** Capture the viewport that owns native scroll position. */
  function captureViewport(element: HTMLDivElement): void {
    viewport = element;
  }

  /** Read native scroll position after the user moves the viewport. */
  function trackScroll(event: Event & { currentTarget: HTMLDivElement }): void {
    const element = event.currentTarget;
    setIsAtBottom(element.scrollHeight - element.clientHeight - element.scrollTop < 3);
  }

  /** Move the viewport to its latest message. */
  function scrollToBottom(): void {
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    setIsAtBottom(true);
  }

  /** Append one timestamped message. */
  function addMessage(): void {
    setMessages(
      /** Append one message after the existing ones. */
      (current) => [
        ...current,
        `Message ${current.length + 1} - ${new Date().toLocaleTimeString()}`,
      ],
    );
  }

  /** Append a batch of five timestamped messages. */
  function addMultipleMessages(): void {
    setMessages(
      /** Append five messages after the existing ones. */
      (current) => [
        ...current,
        ...Array.from(
          { length: 5 },
          /** Label one item in the new batch. */
          (_, index) =>
            `Batch message ${current.length + index + 1} - ${new Date().toLocaleTimeString()}`,
        ),
      ],
    );
  }

  /** Remove the latest message when one exists. */
  function removeMessage(): void {
    setMessages(
      /** Drop the newest message. */
      (current) => current.slice(0, -1),
    );
  }

  createEffect(
    /** Track the messages and whether the reader is at the bottom. */
    () => ({ messages: messages(), atBottom: isAtBottom() }),
    /** Preserve bottom anchoring when the visible message list changes. */
    ({ atBottom }) => {
      if (!atBottom) return;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(
        /** Scroll after Solid commits the new message nodes. */
        () => {
          viewport?.scrollTo({ top: viewport.scrollHeight });
          frame = undefined;
        },
      );
    },
  );

  onCleanup(
    /** Cancel a pending scroll after the Storybook story unmounts. */
    () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
    },
  );

  return (
    <VStack gap="4" align="stretch" class="scroll-area-example-chat">
      <ButtonGroup
        class="scroll-area-example-chat-controls"
        size="sm"
        variant="outline"
        wrap="wrap"
      >
        <Button onClick={addMessage}>Add message</Button>
        <Button onClick={addMultipleMessages}>Add 5 messages</Button>
        <Button onClick={removeMessage}>Remove message</Button>
      </ButtonGroup>
      <ScrollArea.Root class="scroll-area-example-chat-root" size="xs">
        <ScrollArea.Viewport ref={captureViewport} onScroll={trackScroll}>
          <ScrollArea.Content>
            <VStack gap="2" align="stretch" class="scroll-area-example-chat-list">
              <For each={messages()}>
                {(message) => (
                  <div class="scroll-area-example-tile scroll-area-example-chat-message">
                    {message}
                  </div>
                )}
              </For>
            </VStack>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
        <Show when={!isAtBottom()}>
          <Box class="scroll-area-example-chat-jump">
            <IconButton
              size="sm"
              onClick={scrollToBottom}
              colorPalette="blue"
              variant="solid"
              aria-label="Scroll to bottom"
            >
              <span aria-hidden="true">↓</span>
            </IconButton>
          </Box>
        </Show>
      </ScrollArea.Root>
    </VStack>
  );
}
