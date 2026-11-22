import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { guideMarkdownComponents } from './guide-code-block';
import { Markdown } from './markdown';

/** Render the Markdown that accompanies one example: a note above it or copy after it. */
export function GuideStoryCopy(props: { class: string; content: string | undefined }): JSX.Element {
  return (
    <Show when={props.content}>
      {/** Render the copy only when the example has some. */}
      {(content) => (
        <div class={['guide-markdown', props.class]}>
          <Markdown components={guideMarkdownComponents} content={content()} />
        </div>
      )}
    </Show>
  );
}
