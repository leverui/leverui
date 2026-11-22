import { createSignal, For, onSettled, Show, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { loadGuideStories } from '../lib/guide-stories';
import type { GuideStory } from '../lib/guide-story-types';
import { StoryPreview } from './guide-story-preview';

/** One run of written Markdown, or one live example the guide names inline. */
type GuidePart = { markdown: string } | { family: string; id: string };

const exampleMarker = /^<!-- example: ([\w-]+)\/(\w+) -->$/gm;

/** Split a guide at each `<!-- example: family/StoryName -->` line. */
export function splitInlineExamples(content: string): readonly GuidePart[] {
  const parts: GuidePart[] = [];
  let offset = 0;
  for (const match of content.matchAll(exampleMarker)) {
    parts.push({ markdown: content.slice(offset, match.index) });
    parts.push({ family: match[1] ?? '', id: match[2] ?? '' });
    offset = match.index + match[0].length;
  }
  parts.push({ markdown: content.slice(offset) });
  return parts;
}

/** Load one named story in the browser and show it with its Preview and Code tabs. */
function InlineExample(props: { family: string; id: string }): JSX.Element {
  const [story, setStory] = createSignal<GuideStory>();
  onSettled(
    /** Load demo functions in the browser, outside server serialization. */
    () => {
      void loadGuideStories(props.family).then(
        /** Keep the story this marker names. */
        (stories) =>
          setStory(
            stories.find(
              /** Match the story's export name. */
              (candidate) => candidate.id === props.id,
            ),
          ),
      );
    },
  );
  return (
    <Show when={story()}>
      {
        /** Show the loaded example without its own heading. */
        (loaded) => <StoryPreview story={loaded()} heading={false} />
      }
    </Show>
  );
}

/** Render written guidance with its inline live examples in reading order. */
export function GuideInlineExamples(props: {
  content: string;
  markdown: Component<{ content: string }>;
}): JSX.Element {
  return (
    <For each={splitInlineExamples(props.content)}>
      {
        /** Render one Markdown run or one example. */
        (part) =>
          'markdown' in part ? (
            <props.markdown content={part.markdown} />
          ) : (
            <InlineExample family={part.family} id={part.id} />
          )
      }
    </For>
  );
}
