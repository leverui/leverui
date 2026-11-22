import { Title, Meta } from '@solidjs/meta';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { guideMarkdownComponents } from './guide-code-block';
import { Markdown } from './markdown';
import { guideHeadingComponents, LinkedHeading } from './guide-headings';
import { GuidePagination, hasPageNeighbors } from './guide-pagination';
import { GuideSidebar } from './guide-sidebar';
import { GuideInlineExamples } from './guide-inline-examples';
import { GuideStoryGallery } from './guide-story-gallery';
import { AccordionExplorer } from './accordion-explorer';
import { AlertExplorer } from './alert-explorer';
import { ScrollAreaExplorer } from './scroll-area-explorer';
import { GuidePartExplorer } from './guide-part-explorer';
import { GuideToc } from './guide-toc';
import { PageNotFound } from './page-not-found';
import { findGuide } from '../lib/docs';
import { guideBody, guideLead, splitGuideBody } from '../lib/guide-sections';
import { hasGuideStories } from '../lib/guide-stories';
import { guideExplorers } from '../lib/guide-explorers';
import '../styles/docs-guide.css';
import '../styles/docs-responsive.css';
import '../styles/guide-preview.css';
import '../styles/guide-toc.css';

const markdownComponents = { ...guideMarkdownComponents, ...guideHeadingComponents };

/** Render one part of a maintained guide with shared Markdown components. */
function GuideMarkdown(props: { content: string }): JSX.Element {
  return (
    <div class="guide-markdown">
      <Markdown components={markdownComponents} content={props.content} />
    </div>
  );
}

/**
 * Render one maintained Markdown guide inside the website documentation shell. `children` go
 * after the guide's own content; `wide` gives them the table of contents' column too.
 */
export function GuidePage(props: {
  path: string;
  wide?: boolean;
  children?: JSX.Element;
}): JSX.Element {
  /** Resolve the page's address to its maintained Markdown guide. */
  const guide = () => findGuide(props.path);

  return (
    <main
      id="main-content"
      class={[
        'guide-layout page-container',
        {
          'guide-layout-wide': props.wide || guide()?.kind === 'reference',
          'guide-layout-reference': guide()?.kind === 'reference',
        },
      ]}
    >
      <Show when={guide()} fallback={<PageNotFound />}>
        {/** Render the active guide and its neighboring navigation. */}
        {(activeGuide) => {
          /** Find a maintained Solid story family for this visual guide. */
          const hasStories = () =>
            activeGuide().kind === 'component' &&
            hasGuideStories(activeGuide().path.split('/').at(-1) ?? '');
          /** Component and concept guides show their first paragraph as a lead. */
          const hasLead = () => ['component', 'concept'].includes(activeGuide().kind);
          /** Place the first usage snippet before the example gallery. */
          const splitBody = () =>
            splitGuideBody(activeGuide().content, activeGuide().path.split('/').at(-1) ?? '');

          return (
            <>
              <Title>{activeGuide().title} | Lever UI</Title>
              <Meta
                name="description"
                content={`${activeGuide().title} guide for Lever UI and SolidJS.`}
              />
              <GuideSidebar activePath={activeGuide().path} />
              <article class="guide-article">
                <h1 class="guide-title">{activeGuide().title}</h1>
                <Show when={hasLead() && guideLead(activeGuide().content)}>
                  {/** Skip the lead on a guide that opens without a paragraph. */}
                  {(lead) => (
                    <div class="guide-lead">
                      <Markdown components={guideMarkdownComponents} content={lead()} />
                    </div>
                  )}
                </Show>
                <Show when={hasStories()}>
                  <GuideStoryGallery path={activeGuide().path} mode="intro" />
                  <Show when={splitBody().prelude}>
                    <GuideMarkdown content={splitBody().prelude} />
                  </Show>
                  <LinkedHeading level="h2" class="guide-section-heading" id="usage">
                    Usage
                  </LinkedHeading>
                  <GuideMarkdown content={splitBody().intro} />
                  <GuideStoryGallery path={activeGuide().path} mode="examples" />
                  <Show when={splitBody().examplesTail}>
                    <GuideMarkdown content={splitBody().examplesTail} />
                  </Show>
                  <Show when={splitBody().detail}>
                    <GuideMarkdown content={splitBody().detail} />
                  </Show>
                  <Show when={activeGuide().path === '/docs/components/accordion'}>
                    <AccordionExplorer />
                  </Show>
                  <Show when={activeGuide().path === '/docs/components/alert'}>
                    <AlertExplorer />
                  </Show>
                  <Show when={activeGuide().path === '/docs/components/scroll-area'}>
                    <ScrollAreaExplorer />
                  </Show>
                  <Show when={guideExplorers[activeGuide().path.split('/').at(-1) ?? '']}>
                    {(config) => (
                      <GuidePartExplorer
                        config={config()}
                        slug={activeGuide().path.split('/').at(-1) ?? ''}
                      />
                    )}
                  </Show>
                </Show>
                <Show when={!hasStories()}>
                  <GuideInlineExamples
                    content={guideBody(activeGuide().content, hasLead())}
                    markdown={GuideMarkdown}
                  />
                </Show>
                {props.children}
                <Show when={hasPageNeighbors(activeGuide())}>
                  <GuidePagination guide={activeGuide()} />
                </Show>
              </article>
              <GuideToc
                storySlug={hasStories() ? activeGuide().path.split('/').at(-1) : undefined}
                markdown={
                  hasStories()
                    ? `${splitBody().prelude}\n## Usage\n${splitBody().intro}\n${
                        /^## Examples$/m.test(splitBody().detail) ? '' : '## Examples\n'
                      }${splitBody().examplesTail}\n${splitBody().detail}`
                    : activeGuide().content
                }
              />
            </>
          );
        }}
      </Show>
    </main>
  );
}
