import { lazy, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { guideStoryFilename } from './guide-story-aliases';
import { orderGuideStories } from './guide-story-order';
import { guideStoryName, storyName } from './guide-story-name';
import { placeStoryCopy } from './guide-story-note';
import type { GuideStory } from './guide-story-types';

interface GuideStorySource {
  readonly code: string;
  readonly description: string;
  readonly file: string;
}

type StoryDecorator = (story: () => JSX.Element) => JSX.Element;

interface StoryRecord {
  readonly name?: string;
  readonly args?: Record<string, unknown>;
  readonly render?: (args: Record<string, unknown>) => JSX.Element;
  readonly parameters?: {
    readonly guide?: {
      readonly description?: string;
      readonly descriptionFormat?: 'markdown';
      readonly heading?: boolean;
      readonly subheading?: string;
      readonly after?: string;
    };
  };
}

interface StoryModule {
  readonly meta: {
    readonly args?: Record<string, unknown>;
    readonly component?: (args: Record<string, unknown>) => JSX.Element;
    readonly decorators?: readonly StoryDecorator[];
    readonly parameters?: {
      readonly guide?: {
        readonly outerInset?: boolean;
        readonly selfPadded?: boolean;
        readonly naturalHeight?: boolean;
      };
    };
  };
  readonly [exportName: string]: unknown;
}

/** What one generated family module bundles: the stories, their source and code panels. */
export interface GuideFamilyParts {
  readonly stories: unknown;
  readonly source: string;
  readonly panels: unknown;
}

/** The props a family's gallery component takes from its guide page. */
export interface GuideFamilyProps {
  readonly slug: string;
  readonly mode: 'intro' | 'examples';
}

interface FamilyModule {
  readonly default: Component<GuideFamilyProps>;
  readonly parts: GuideFamilyParts;
}

// One generated module per demo family, written by scripts/guide-family-module.mjs.
const familyModules = import.meta.glob<FamilyModule>('../generated/guide-families/*.js');
const familyComponents = new Map<string, Component<GuideFamilyProps>>();

/** Name a family's generated module the way the glob above keys it. */
function familyKey(slug: string): string {
  return `../generated/guide-families/${guideStoryFilename(slug)}.js`;
}

/** Identify guides backed by a demo family. */
export function hasGuideStories(slug: string): boolean {
  return familyKey(slug) in familyModules;
}

/**
 * The gallery component for one guide's demo family, loaded as its own chunk. It is a `lazy`
 * component, so the prerender waits for it and writes its examples into the page, the browser
 * preloads it before hydration, and a page switch holds the old page until it is ready.
 */
export function guideFamilyComponent(slug: string): Component<GuideFamilyProps> | undefined {
  const key = familyKey(slug);
  const importer = familyModules[key];
  if (!importer) return undefined;
  let component = familyComponents.get(key);
  if (!component) {
    component = lazy(importer, undefined, key.replace('../', 'src/'));
    familyComponents.set(key, component);
  }
  return component;
}

/** Identify usable demo objects. */
function isStoryRecord(value: unknown): value is StoryRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Apply the demo's context and layout wrappers in order. */
function renderStory(
  render: (args: Record<string, unknown>) => JSX.Element,
  args: Record<string, unknown>,
  decorators: readonly StoryDecorator[],
): JSX.Element {
  /** Invoke the selected story with its documented arguments. */
  let wrapped = (): JSX.Element => render(args);
  for (const decorator of [...decorators].reverse()) {
    const inner = wrapped;
    /** Wrap the inner example with one decorator. */
    wrapped = (): JSX.Element => decorator(inner);
  }
  return wrapped();
}

/** Require multi-line descriptions to opt into Markdown instead of guessing from their text. */
function assertDescriptionFormat(
  story: string,
  description: string | undefined,
  markdown: boolean,
): void {
  if (description?.includes('\n') && !markdown) {
    throw new Error(`${story}: a multi-line description needs descriptionFormat: 'markdown'.`);
  }
}

/** Load the demo family for one component guide in the browser. */
export async function loadGuideStories(slug: string): Promise<readonly GuideStory[]> {
  const importer = familyModules[familyKey(slug)];
  return importer ? buildGuideStories(slug, (await importer()).parts) : [];
}

/** Turn one loaded demo family into the guide's ordered examples. */
export function buildGuideStories(slug: string, parts: GuideFamilyParts): readonly GuideStory[] {
  const module = parts.stories as StoryModule;
  const sourceMap = parts.panels as Readonly<Record<string, GuideStorySource>>;
  const source = parts.source;
  const decorators = module.meta.decorators ?? [];
  const exportNames = [...source.matchAll(/export const ([A-Za-z_]\w*): Story\b/g)].map(
    /** Preserve the authored example order. */
    (match) => match[1] ?? '',
  );
  const stories = exportNames
    .map(
      /** Resolve one authored export to its compiled Solid story. */
      (name) => [name, module[name]] as const,
    )
    .filter(
      /** Omit the family settings and non-demo exports. */
      (entry): entry is readonly [string, StoryRecord] => isStoryRecord(entry[1]),
    )
    .map(
      /** Bind the story's declared arguments to its render function. */
      ([name, value]) => {
        const story = value as StoryRecord;
        const render = story.render ?? module.meta.component;
        if (!render) return undefined;
        const args = { ...module.meta.args, ...story.args };
        const source = sourceMap[name];
        const description = story.parameters?.guide?.description ?? source?.description;
        const descriptionMarkdown = story.parameters?.guide?.descriptionFormat === 'markdown';
        assertDescriptionFormat(`${slug}/${name}`, description, descriptionMarkdown);
        return {
          id: name,
          name: guideStoryName(slug, name, story.name ?? storyName(name)),
          /** Render the example with its arguments. */
          render: () => renderStory(render, args, decorators),
          decorated: decorators.length > 0,
          outerInset: module.meta.parameters?.guide?.outerInset ?? false,
          selfPadded: module.meta.parameters?.guide?.selfPadded ?? false,
          naturalHeight: module.meta.parameters?.guide?.naturalHeight ?? false,
          code: source?.code,
          description,
          descriptionMarkdown,
          heading: story.parameters?.guide?.heading ?? true,
          subheading: story.parameters?.guide?.subheading,
          ...placeStoryCopy(story.parameters?.guide?.after),
          sourceFile: source?.file,
        };
      },
    )
    .filter(
      /** Omit exports without a renderable example. */
      (story): story is GuideStory => story !== undefined,
    );
  return orderGuideStories(slug, stories);
}
