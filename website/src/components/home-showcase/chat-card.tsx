import { Avatar, Button, Card, IconButton, Input, ScrollArea, Status } from '@leverui/components';
import { ArrowUpIcon, RotateCcwIcon } from '@lucide/solid';
import { createSignal, For, onCleanup, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Answer } from '../../lib/docs-assistant';
import { ChatMessages, type ChatMessage } from './chat-messages';
import '../../styles/home-showcase-chat.css';

const welcome: ChatMessage = {
  from: 'assistant',
  text: 'Hi! I can point you to the right page in the Lever UI docs. Ask about a component, theming, or setup.',
};
const suggestions = [
  'How do I install it?',
  'Is there a date picker?',
  'Does it support dark mode?',
  'Is it accessible?',
];
/** Long enough to read as a reply, short enough not to feel slow. */
const thinkingTime = 600;

let answerer: Promise<(question: string) => Answer> | undefined;

/**
 * Load the docs and build their index the first time a question is asked. The docs are large,
 * so the home page does not load them up front.
 */
function loadAnswerer(): Promise<(question: string) => Answer> {
  answerer ??= Promise.all([import('../../lib/docs'), import('../../lib/docs-assistant')]).then(
    /** Index every guide once, and answer from that index. */
    ([docs, assistant]) => {
      const index = assistant.createDocsIndex(docs.guides);
      return (question: string) => assistant.answerQuestion(index, question);
    },
  );
  return answerer;
}

/** A chat that answers questions about Lever UI with links to the docs. */
export function ChatCard(): JSX.Element {
  const [messages, setMessages] = createSignal<readonly ChatMessage[]>([welcome]);
  const [draft, setDraft] = createSignal('');
  const [typing, setTyping] = createSignal(false);
  let thread: HTMLDivElement | undefined;
  // Counts restarts, so a reply to a question from before a restart is dropped.
  let conversation = 0;

  onCleanup(
    /** Drop a reply that arrives after the card is gone. */
    () => {
      conversation += 1;
    },
  );

  /** Show the newest message at the bottom of the thread. */
  function scrollToEnd(): void {
    requestAnimationFrame(
      /** Wait for the new message to render. */
      () => {
        const viewport = thread?.querySelector('.lui-scroll-area__viewport');
        viewport?.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      },
    );
  }

  /** Post a question, then the docs' answer to it. */
  async function ask(question: string): Promise<void> {
    if (!question.trim() || typing()) return;
    const asked = conversation;
    setMessages((current) => [...current, { from: 'you', text: question }]);
    setTyping(true);
    scrollToEnd();
    const pause = new Promise((resolve) => setTimeout(resolve, thinkingTime));
    let reply: ChatMessage;
    try {
      const [answer] = await Promise.all([loadAnswerer(), pause]);
      reply = { from: 'assistant', ...answer(question) };
    } catch {
      reply = { from: 'assistant', text: 'The docs could not load. Please try again.' };
    }
    if (asked !== conversation) return;
    setTyping(false);
    setMessages((current) => [...current, reply]);
    scrollToEnd();
  }

  /** Send what was typed. */
  function send(event: SubmitEvent): void {
    event.preventDefault();
    const question = draft();
    setDraft('');
    void ask(question);
  }

  /** Start the conversation over. */
  function restart(): void {
    conversation += 1;
    setTyping(false);
    setMessages([welcome]);
  }

  return (
    <Card.Root size="sm">
      <Card.Header>
        <div class="home-example-row">
          <Avatar.Root size="sm">
            <Avatar.Image src="/demo-images/avatars/avatar-1.webp" alt="" />
            <Avatar.Fallback name="Ask about Lever UI" />
          </Avatar.Root>
          <span class="home-example-person">
            <strong>Ask about Lever UI</strong>
            <Status.Root colorPalette="green" size="sm">
              <Status.Indicator />
              Online
            </Status.Root>
          </span>
          <IconButton
            type="button"
            size="xs"
            variant="ghost"
            aria-label="Start over"
            title="Start over"
            onClick={restart}
          >
            <RotateCcwIcon />
          </IconButton>
        </div>
      </Card.Header>
      <Card.Body>
        <div class="home-showcase-chat" ref={thread}>
          <ScrollArea.Root class="home-showcase-thread">
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                <ChatMessages messages={messages()} typing={typing()} />
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          <Show when={!typing() && (messages().length === 1 || messages().at(-1)?.suggest)}>
            <div class="home-showcase-chips" role="group" aria-label="Example questions">
              <For each={suggestions}>
                {/** One example question. */}
                {(question) => (
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={
                      /** Ask this question. */
                      () => void ask(question)
                    }
                  >
                    {question}
                  </Button>
                )}
              </For>
            </div>
          </Show>
          <form class="home-example-row" onSubmit={send}>
            <Input
              size="sm"
              placeholder="Ask about a component"
              aria-label="Question"
              value={draft()}
              onFocus={
                /** Start loading the docs while the question is typed. */
                () => void loadAnswerer()
              }
              onInput={
                /** Keep what has been typed. */
                (event) => setDraft(event.currentTarget.value)
              }
            />
            <IconButton
              type="submit"
              size="sm"
              colorPalette="cyan"
              aria-label="Send question"
              disabled={!draft().trim() || typing()}
            >
              <ArrowUpIcon />
            </IconButton>
          </form>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
