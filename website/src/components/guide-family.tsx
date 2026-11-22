import { For, Show, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { guideIntroStoryCount } from '../lib/guide-example-order';
import {
  buildGuideStories,
  type GuideFamilyParts,
  type GuideFamilyProps,
} from '../lib/guide-stories';
import { LinkedHeading } from './guide-headings';
import { StoryPreview } from './guide-story-preview';

/**
 * Build the gallery component for one demo family. Each generated family module calls this
 * with its stories, so the examples arrive with the component that renders them.
 */
export function guideFamily(parts: GuideFamilyParts): Component<GuideFamilyProps> {
  /** Show the family's first example above Usage, or the rest under Examples. */
  return function GuideFamily(props: GuideFamilyProps): JSX.Element {
    /** Follow the guide this family is shown on; aliases share one family. */
    const stories = () => buildGuideStories(props.slug, parts);
    /** Follow whether the guide shows its first example above Usage. */
    const introCount = () => guideIntroStoryCount(props.slug);

    return (
      <>
        <Show when={props.mode === 'intro' && introCount() > 0 && stories()[0]}>
          {/** Keep the first example beside the guide introduction. */}
          {(story) => (
            <div class="guide-story-intro">
              <StoryPreview story={story()} heading={false} />
            </div>
          )}
        </Show>
        <Show when={props.mode === 'examples' && stories().length > introCount()}>
          <div class="guide-story-gallery">
            <LinkedHeading level="h2" id="examples">
              Examples
            </LinkedHeading>
            <For each={stories().slice(introCount())}>
              {/** Keep the same examples and order as the Lever UI Storybook. */}
              {(story) => <StoryPreview story={story} />}
            </For>
          </div>
        </Show>
      </>
    );
  };
}
