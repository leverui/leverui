/**
 * A guide's title, address, and kind, without its text. The full guides and the build-time
 * guide index (`virtual:guide-index`) both work these out here, so they always agree.
 */
import { conceptRoute } from './concept-pages';
import { referenceTitle } from './reference-title';

export type GuideKind = 'overview' | 'component' | 'concept' | 'reference';

/** What the navigation needs to know about a guide. */
export interface GuideMeta {
  readonly title: string;
  readonly path: string;
  readonly kind: GuideKind;
}

/** Turn a guide filename into a readable fallback heading. */
function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .split('-')
    .map(
      /** Capitalize one word of a filename. */
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}

/** A guide's title: its first Markdown heading, or a name made from its filename. */
export function guideTitle(kind: GuideKind, filename: string, content: string): string {
  if (kind === 'reference') return referenceTitle(filename);
  return content.match(/^# (.+)$/m)?.[1] ?? titleFromFilename(filename);
}

/** The public address of a guide of a given kind. */
export function guidePath(kind: GuideKind, slug: string): string {
  if (kind === 'reference') return `/docs/theme-variables${slug === 'README' ? '' : `/${slug}`}`;
  if (kind === 'concept') return conceptRoute(slug);
  return `/docs/${kind === 'component' ? 'components/' : ''}${slug}`;
}

/** Sort guides by title, as the navigation lists them. */
export function byTitle(first: GuideMeta, second: GuideMeta): number {
  return first.title.localeCompare(second.title);
}
