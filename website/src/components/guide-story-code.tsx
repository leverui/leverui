import { type JSX } from '@solidjs/web';
import type { GuideStory } from '../lib/guide-story-types';
import { GuideCodeBlock } from './guide-code-block';

/** Show the public Solid source of one example. */
export function GuideStoryCode(props: { story: GuideStory }): JSX.Element {
  return (
    <div class="guide-story-code" role="region" aria-label={`${props.story.name} code`}>
      <GuideCodeBlock floatingCopy source={props.story.code} />
    </div>
  );
}
