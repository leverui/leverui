import { createSignal, For, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ScrollArea } from '../src';

const initialMessages = Array.from(
  { length: 15 },
  /** Give the feed stable initial content and enough height to overflow. */
  (_, index) => `Message ${index + 1}`,
);

/** Keep a growing feed at the bottom until the reader scrolls away. */
function StickyFeed(): JSX.Element {
  let viewport: HTMLDivElement | undefined;
  const [messages, setMessages] = createSignal(initialMessages);
  const [pinned, setPinned] = createSignal(true);

  /** Store the machine viewport for measured native scrolling. */
  function captureViewport(element: HTMLDivElement): void {
    viewport = element;
  }

  /** Track whether the reader is close enough to the lower edge to follow. */
  function updatePinned(): void {
    if (!viewport) return;
    const distance = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
    setPinned(distance <= 2);
  }

  /** Move to the end and resume following new messages. */
  function scrollToBottom(): void {
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
    setPinned(true);
  }

  /** Append one item, preserving the reader's position when unpinned. */
  function addMessage(): void {
    const shouldFollow = pinned();
    setMessages(
      /** Append the next label to the current feed without replacing earlier rows. */
      (current) => [...current, `Message ${current.length + 1}`],
    );
    if (shouldFollow) requestAnimationFrame(scrollToBottom);
  }

  onSettled(scrollToBottom);

  return (
    <>
      <button type="button" onClick={addMessage}>
        Add message
      </button>
      <ScrollArea.Root style={{ height: '11rem', width: '20rem' }} variant="always">
        <ScrollArea.Viewport
          ref={captureViewport}
          onScroll={updatePinned}
          data-testid="feed-viewport"
        >
          <ScrollArea.Content>
            <For each={messages()}>
              {/** Render the growing feed in document order. */}
              {(message) => <p data-testid="feed-message">{message}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
        <Show when={!pinned()}>
          <button type="button" onClick={scrollToBottom}>
            Jump to bottom
          </button>
        </Show>
      </ScrollArea.Root>
    </>
  );
}

const meta = {
  title: 'Components/Scroll Area Feed',
  component: StickyFeed,
} satisfies Meta<typeof StickyFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StickToBottom: Story = { render: StickyFeed };
