import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { AnswerLink } from '../../lib/docs-assistant';

/** One message in the chat; the assistant's can link to docs pages. */
export interface ChatMessage {
  readonly from: 'assistant' | 'you';
  readonly text: string;
  readonly links?: readonly AnswerLink[];
  /** Offer the example questions after this message. */
  readonly suggest?: boolean;
}

/** The thread: your messages on the right, the assistant's on the left with its links. */
export function ChatMessages(props: {
  messages: readonly ChatMessage[];
  typing: boolean;
}): JSX.Element {
  return (
    <div class="home-showcase-messages" role="log" aria-label="Chat with the docs">
      <For each={props.messages}>
        {/** One message. */}
        {(message) => (
          <div class="home-showcase-message" data-from={message.from}>
            <p>{message.text}</p>
            <Show when={message.links?.length}>
              <ul class="home-showcase-answer-links">
                <For each={message.links ?? []}>
                  {/** One docs page, with its one-line summary. */}
                  {(link) => (
                    <li>
                      <a
                        href={link.path}
                        target={link.path.startsWith('http') ? '_blank' : undefined}
                        rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <strong>{link.title}</strong>
                        <span>{link.summary}</span>
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        )}
      </For>
      <Show when={props.typing}>
        <span class="home-showcase-typing" role="status" aria-label="Searching the docs">
          <span />
          <span />
          <span />
        </span>
      </Show>
    </div>
  );
}
