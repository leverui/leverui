/** Concept pages in sidebar order. */
export const conceptPageOrder = [
  'overview',
  'composition',
  'animation',
  'color-mode',
  'testing',
] as const;

/** The public URL prefix every Components > Concepts page lives under. */
export const conceptRoutePrefix = '/docs/components/concepts';

/** Sidebar labels for pages whose heading differs from their link text. */
const conceptNavigationTitles: Readonly<Record<string, string>> = {
  overview: 'Overview',
};

/** Build the public URL of one concept page. */
export function conceptRoute(slug: string): string {
  return `${conceptRoutePrefix}/${slug}`;
}

/** Read a concept page's slug from its route or source path. */
function conceptSlug(path: string): string {
  return (path.split('/').at(-1) ?? '').replace(/\.md$/, '');
}

/** Label a concept page for the navigation. */
export function conceptNavigationTitle(path: string, fallback: string): string {
  return conceptNavigationTitles[conceptSlug(path)] ?? fallback;
}

/** Rank a concept page by sidebar order, rejecting pages missing from that order. */
export function conceptOrderIndex(path: string): number {
  const slug = conceptSlug(path);
  const index = (conceptPageOrder as readonly string[]).indexOf(slug);
  if (index === -1) {
    throw new Error(`Concept page "${slug}" must be listed in conceptPageOrder.`);
  }
  return index;
}

/** Fail fast when a concept source is published without a place in the sidebar order. */
export function assertConceptPagesListed(slugs: readonly string[]): void {
  for (const slug of slugs) conceptOrderIndex(slug);
}
