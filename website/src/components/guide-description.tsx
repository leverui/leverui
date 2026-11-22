import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Render short Storybook explanations with inline code shown as code. */
export function GuideDescription(props: { text: string }): JSX.Element {
  return (
    <For each={props.text.split(/(`[^`]+`)/g)}>
      {/** Keep ordinary words as text and unwrap authored inline code markers. */}
      {(part) =>
        part.startsWith('`') && part.endsWith('`') ? <code>{part.slice(1, -1)}</code> : part
      }
    </For>
  );
}
