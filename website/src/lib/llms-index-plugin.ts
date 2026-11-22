/**
 * A Vite plugin that writes `llms.txt` at the site root: every published guide, with its
 * address on the site and its first sentence, for AI tools that read docs on the web.
 */
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';
import { formatLlmsIndex, type LlmsGuide } from '../../../scripts/llms-index.mjs';
import { guideSources, type GuideSource } from './guide-index-plugin';
import { byTitle, guidePath, guideTitle, type GuideKind } from './guide-meta';

const siteAddress = 'https://leverui.com';
const introduction = `These guides cover the latest release of \`@leverui/components\`. In a project with the package installed, the guides for the installed version are in \`node_modules/@leverui/components/dist/docs\`, with their own \`llms.txt\`. Read the guide for a component before using it, and use only the props, parts, and CSS variables it documents.`;

/** The index's sections, in order, with the kind of guide each lists. */
const sections: readonly { readonly title: string; readonly kind: GuideKind }[] = [
  { title: 'Guides', kind: 'overview' },
  { title: 'Concepts', kind: 'concept' },
  { title: 'Components', kind: 'component' },
  { title: 'Theme variables', kind: 'reference' },
];

/** Read one guide file as an index entry with its site address. */
function toGuide(source: GuideSource): LlmsGuide {
  const filename = source.file.split('/').at(-1) ?? '';
  const content = readFileSync(source.file, 'utf8');
  return {
    content,
    title: guideTitle(source.kind, filename, content),
    href: `${siteAddress}${guidePath(source.kind, filename.replace(/\.md$/, ''))}`,
  };
}

/** Write `llms.txt` beside the client build. */
export function llmsIndexPlugin(docsDirectory: string, overviewSlugs: readonly string[]): Plugin {
  return {
    name: 'leverui-llms-index',
    apply: 'build',
    applyToEnvironment:
      /** Emit the index with the client build only. */
      (environment) => environment.name === 'client',
    /** Add the index to the client output. */
    generateBundle() {
      const sources = guideSources(docsDirectory, overviewSlugs);
      const index = formatLlmsIndex(
        introduction,
        sections.map(
          /** List one section's guides by title. */
          (section) => ({
            title: section.title,
            guides: sources
              .filter(
                /** Keep the guides of this section's kind. */
                (source) => source.kind === section.kind,
              )
              .map(toGuide)
              .sort(
                /** Order guides as the site menu does. */
                (first, second) =>
                  byTitle(
                    { title: first.title ?? '', path: first.href, kind: section.kind },
                    { title: second.title ?? '', path: second.href, kind: section.kind },
                  ),
              ),
          }),
        ),
      );
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: index });
    },
  };
}
