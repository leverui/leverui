import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { GuideStory } from '../lib/guide-story-types';
import { sectionId } from '../lib/guide-sections';
import { guideMarkdownComponents } from './guide-code-block';
import { GuideDescription } from './guide-description';
import { LinkedHeading } from './guide-headings';
import { Markdown } from './markdown';
import { GuideStoryCode } from './guide-story-code';
import { GuideStoryCopy } from './guide-story-copy';

/** Render one maintained Solid Storybook example inside the website guide. */
export function StoryPreview(props: { story: GuideStory; heading?: boolean }): JSX.Element {
  const [panel, setPanel] = createSignal<'preview' | 'code'>('preview');

  /** Return to the interactive component preview. */
  function showPreview(): void {
    setPanel('preview');
  }

  /** Show the maintained Solid source for this example. */
  function showCode(): void {
    setPanel('code');
  }

  return (
    <section class="guide-story" aria-label={`${props.story.name} example`}>
      <Show when={props.heading !== false}>
        <Show when={props.story.heading}>
          <LinkedHeading level="h3" id={`example-${sectionId(props.story.id)}`}>
            {props.story.name}
          </LinkedHeading>
        </Show>
        <Show when={props.story.description}>
          <Show
            when={props.story.descriptionMarkdown}
            fallback={
              <p class="guide-story-description">
                <GuideDescription text={props.story.description ?? ''} />
              </p>
            }
          >
            <div class="guide-markdown guide-story-description">
              <Markdown
                components={guideMarkdownComponents}
                content={props.story.description ?? ''}
              />
            </div>
          </Show>
        </Show>
        <Show when={props.story.subheading}>
          <h4>{props.story.subheading}</h4>
        </Show>
      </Show>
      <GuideStoryCopy class="guide-story-note" content={props.story.note} />
      <Show when={props.story.code}>
        <div class="guide-story-tabs" role="group" aria-label={`${props.story.name} example view`}>
          <button
            type="button"
            aria-pressed={panel() === 'preview' ? 'true' : 'false'}
            onClick={showPreview}
          >
            Preview
          </button>
          <button
            type="button"
            aria-pressed={panel() === 'code' ? 'true' : 'false'}
            onClick={showCode}
          >
            Code
          </button>
        </div>
      </Show>
      <Show when={panel() === 'preview'}>
        <div
          class={[
            'guide-story-surface',
            {
              'has-decorator': props.story.decorated,
              'has-outer-inset': props.story.outerInset,
              'is-self-padded': props.story.selfPadded,
              'is-natural-height': props.story.naturalHeight,
            },
          ]}
          role="region"
          aria-label={`${props.story.name} preview`}
        >
          <props.story.render />
        </div>
      </Show>
      <Show when={panel() === 'code' && props.story.code}>
        <GuideStoryCode story={props.story} />
      </Show>
      <GuideStoryCopy class="guide-story-after" content={props.story.after} />
    </section>
  );
}
