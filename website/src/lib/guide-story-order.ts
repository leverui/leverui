import { guideExampleEntries } from './guide-examples';
import type { GuideStory } from './guide-story-types';

/** Follow the guide's reference example sequence while excluding Storybook-only demos. */
export function orderGuideStories(
  slug: string,
  stories: readonly GuideStory[],
): readonly GuideStory[] {
  const entries = guideExampleEntries(slug);
  const omitted = new Set(
    entries
      .filter(
        /** Select the Storybook-only demos this guide leaves out. */
        (entry) => entry.omit,
      )
      .map(
        /** Match omitted demos by their Storybook export name. */
        (entry) => entry.id,
      ),
  );
  const ranks = new Map(
    entries.map(
      /** Keep each matched example's reference position. */
      (entry, index) => [entry.id, index],
    ),
  );
  return stories
    .filter(
      /** Keep Storybook-only examples out of this guide's section sequence. */
      (story) => !omitted.has(story.id),
    )
    .sort(
      /** Keep unmatched Storybook examples after the documented sequence. */
      (left, right) => {
        const leftRank = ranks.get(left.id) ?? Number.POSITIVE_INFINITY;
        const rightRank = ranks.get(right.id) ?? Number.POSITIVE_INFINITY;
        return leftRank - rightRank;
      },
    );
}
