import { conceptRoute } from './concept-pages';
import { byTitle, guidePath, guideTitle, type GuideMeta } from './guide-meta';
import { mergeMarkdownParts } from './markdown-parts';

/** A published guide loaded from the library's maintained Markdown. */
export interface Guide extends GuideMeta {
  readonly content: string;
  readonly summary: string;
}

const componentFiles = import.meta.glob('../../../docs/components/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const overviewFiles = import.meta.glob(
  [
    '../../../docs/getting-started.md',
    '../../../docs/theme-guide.md',
    '../../../docs/colors.md',
    '../../../docs/charts.md',
    '../../../docs/accessibility.md',
    '../../../docs/server-rendering.md',
    '../../../docs/responsive-styles.md',
    '../../../docs/custom-systems.md',
    '../../../docs/tailwind.md',
    '../../../docs/ai-agents.md',
  ],
  { eager: true, import: 'default', query: '?raw' },
) as Record<string, string>;

const conceptFiles = import.meta.glob('../../../docs/concepts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const referenceFiles = import.meta.glob('../../../docs/theme-variables/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

/** Rewrite relative guide links to stable website routes. */
function resolveLinks(content: string, kind: Guide['kind']): string {
  return content.replace(
    /\]\(([^)#]+\.md)(#[^)]*)?\)/g,
    /** Resolve links from either the docs root or a component guide. */
    (match, relativePath: string, anchor: string | undefined) => {
      if (relativePath.startsWith('/') || relativePath.includes('://')) return match;
      const segments = relativePath.split('/');
      const filename = segments.at(-1)?.replace(/\.md$/, '') ?? '';
      if (filename === 'theming') return `](/docs/theme-guide${anchor ?? ''})`;
      if (filename === 'README') {
        const destination =
          kind === 'reference' || segments.includes('theme-variables')
            ? '/docs/theme-variables'
            : '/docs/getting-started';
        return `](${destination}${anchor ?? ''})`;
      }
      if (
        segments.includes('theme-variables') ||
        (kind === 'reference' && !segments.includes('..'))
      ) {
        return `](/docs/theme-variables/${filename}${anchor ?? ''})`;
      }
      if (segments.includes('concepts') || (kind === 'concept' && segments.length === 1)) {
        return `](${conceptRoute(filename)}${anchor ?? ''})`;
      }
      const isComponent =
        segments.includes('components') || (kind === 'component' && !segments.includes('..'));
      return `](/docs/${isComponent ? 'components/' : ''}${filename}${anchor ?? ''})`;
    },
  );
}

/** Normalize a Markdown source into a public guide record. */
function createGuide(sourcePath: string, content: string, kind: Guide['kind']): Guide {
  const filename = sourcePath.split('/').at(-1) ?? '';
  const slug = filename.replace(/\.md$/, '');
  const title = guideTitle(kind, filename, content);
  const readableContent = kind === 'reference' ? content.replace(/^# .+$/m, `# ${title}`) : content;
  return {
    title,
    path: guidePath(kind, slug),
    content: resolveLinks(readableContent, kind),
    summary:
      content
        .split(/\n\s*\n/)
        .find(
          /** Find the first paragraph after the title. */
          (block) => !block.startsWith('#') && !block.startsWith('```'),
        )
        ?.replace(/\s+/g, ' ')
        .replace(/[`*]/g, '')
        .slice(0, 150) ?? '',
    kind,
  };
}

export const guides: readonly Guide[] = [
  ...Object.entries(overviewFiles).map(
    /** Build each introductory guide. */
    ([path, content]) => createGuide(path, content, 'overview'),
  ),
  ...mergeMarkdownParts(componentFiles)
    .filter(
      /** Keep the catalog index out of individual guide routes. */
      ([path]) => !path.endsWith('/README.md'),
    )
    .map(
      /** Build each component guide. */
      ([path, content]) => createGuide(path, content, 'component'),
    ),
  ...mergeMarkdownParts(conceptFiles).map(
    /** Build each Components > Concepts page. */
    ([path, content]) => createGuide(path, content, 'concept'),
  ),
  ...Object.entries(referenceFiles).map(
    /** Publish the generated CSS variable reference alongside the guides. */
    ([path, content]) => createGuide(path, content, 'reference'),
  ),
].sort(byTitle);

/** Find a statically published guide by its route. */
export function findGuide(path: string): Guide | undefined {
  return guides.find(
    /** Match the requested route exactly. */
    (guide) => guide.path === path,
  );
}
