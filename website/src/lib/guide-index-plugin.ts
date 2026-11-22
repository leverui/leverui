/**
 * A Vite plugin that serves `virtual:guide-index`: every guide's title, address, and kind,
 * read from the Markdown at build time. The site menu, on every page, needs only this list,
 * not the full text of every guide.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { byTitle, guidePath, guideTitle, type GuideKind, type GuideMeta } from './guide-meta';
import { isMarkdownPart } from './markdown-parts';

const moduleId = 'virtual:guide-index';
const resolvedId = `\0${moduleId}`;

/** One Markdown file that becomes a guide. */
export interface GuideSource {
  readonly file: string;
  readonly kind: GuideKind;
}

/** List a folder's guide files; continuation parts belong to their page's own file. */
function filesIn(directory: string, kind: GuideKind, skip: readonly string[] = []): GuideSource[] {
  return readdirSync(directory)
    .filter(
      /** Keep the files that start a guide. */
      (name) => name.endsWith('.md') && !isMarkdownPart(name) && !skip.includes(name),
    )
    .map(
      /** Pair the file with its kind. */
      (name) => ({ file: join(directory, name), kind }),
    );
}

/** Every guide's file, in the four groups the site publishes. */
export function guideSources(
  docsDirectory: string,
  overviewSlugs: readonly string[],
): GuideSource[] {
  return [
    ...overviewSlugs.map(
      /** One overview guide at the top of the docs folder. */
      (slug): GuideSource => ({ file: join(docsDirectory, `${slug}.md`), kind: 'overview' }),
    ),
    ...filesIn(join(docsDirectory, 'components'), 'component', ['README.md']),
    ...filesIn(join(docsDirectory, 'concepts'), 'concept'),
    ...filesIn(join(docsDirectory, 'theme-variables'), 'reference'),
  ];
}

/** Serve the guide index from the docs folder, with the overview guides the site publishes. */
export function guideIndexPlugin(docsDirectory: string, overviewSlugs: readonly string[]): Plugin {
  return {
    name: 'leverui-guide-index',
    /** Claim the virtual module's name. */
    resolveId(id) {
      return id === moduleId ? resolvedId : undefined;
    },
    /** Write the index, and rebuild it when a guide changes. */
    load(id) {
      if (id !== resolvedId) return undefined;
      const index: GuideMeta[] = guideSources(docsDirectory, overviewSlugs).map(
        /** Read one guide's title and address. */
        ({ file, kind }) => {
          this.addWatchFile(file);
          const filename = file.split('/').at(-1) ?? '';
          return {
            title: guideTitle(kind, filename, readFileSync(file, 'utf8')),
            path: guidePath(kind, filename.replace(/\.md$/, '')),
            kind,
          };
        },
      );
      return `export const guideIndex = ${JSON.stringify(index.sort(byTitle))};`;
    },
  };
}
