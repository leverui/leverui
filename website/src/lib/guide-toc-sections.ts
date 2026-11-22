import { createEffect, createSignal, type Accessor } from 'solid-js';
import { guideIntroStoryCount } from './guide-example-order';
import { guideSections, sectionId, type GuideSection } from './guide-sections';
import { loadGuideStories } from './guide-stories';

/** The guide content the On this page list is built from. */
export interface GuideTocSource {
  readonly markdown: string;
  readonly storySlug?: string | undefined;
}

/** List a guide's written headings, with its live example headings after Examples. */
export function createGuideTocSections(source: GuideTocSource): Accessor<readonly GuideSection[]> {
  const [examples, setExamples] = createSignal<readonly GuideSection[]>([]);

  createEffect(
    /** Reload example headings when the active guide changes. */
    () => source.storySlug,
    /** Add example anchors after the interactive stories load in the browser. */
    (slug) => {
      let active = true;
      setExamples([]);
      if (slug) {
        void loadGuideStories(slug).then(
          /** Ignore results from a guide that is no longer active. */
          (stories) => {
            if (!active) return;
            setExamples(
              stories
                .slice(guideIntroStoryCount(slug))
                .filter(
                  /** Exclude follow-up demos without their own visible heading. */
                  (story) => story.heading,
                )
                .map(
                  /** Link to one live story heading. */
                  (story) => ({
                    title: story.name,
                    id: `example-${sectionId(story.id)}`,
                    depth: 3,
                  }),
                ),
            );
          },
          /** Leave written headings available when examples fail to load. */
          () => {
            if (active) setExamples([]);
          },
        );
      }
      return () => {
        /** Discard pending story metadata after route navigation. */
        active = false;
      };
    },
  );

  return () => {
    const written = guideSections(source.markdown);
    const index = written.findIndex(
      /** Insert live examples after the written Examples heading. */
      (section) => section.id === 'examples',
    );
    if (index < 0) return written;
    return [...written.slice(0, index + 1), ...examples(), ...written.slice(index + 1)];
  };
}
