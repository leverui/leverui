import { Errored, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { guideFamilyComponent } from '../lib/guide-stories';

/** Show interactive examples beside the written component guidance. */
export function GuideStoryGallery(props: {
  path: string;
  mode: 'intro' | 'examples';
}): JSX.Element {
  /** Follow the active guide when navigating between component pages. */
  const slug = () => props.path.split('/').at(-1) ?? '';

  return (
    <Errored
      fallback={
        <p class="guide-story-loading" role="status">
          The interactive examples could not load. The usage code below is still available.
        </p>
      }
    >
      <Show when={guideFamilyComponent(slug())} keyed>
        {/** Mount the family's own gallery, loaded as one chunk with its examples. */}
        {(Family) => <Family slug={slug()} mode={props.mode} />}
      </Show>
    </Errored>
  );
}
