import { conceptRoute, conceptRoutePrefix } from './concept-pages';
import { guideCategories } from './guide-categories';

/** The documentation tabs, in display order. */
export type DocsSection = 'get-started' | 'components' | 'charts' | 'theming';

/** One tab in the docs header, with the page it opens. */
export interface DocsTab {
  readonly section: DocsSection;
  readonly label: string;
  readonly href: string;
}

export const docsTabs: readonly DocsTab[] = [
  { section: 'get-started', label: 'Get Started', href: '/docs/getting-started' },
  { section: 'components', label: 'Components', href: conceptRoute('overview') },
  { section: 'charts', label: 'Charts', href: '/docs/charts' },
  { section: 'theming', label: 'Theming', href: '/docs/theme-guide' },
];

/** Where each written guide sits: its tab and its sidebar group. */
export const overviewPlacement: Readonly<
  Record<string, { readonly section: DocsSection; readonly group: string }>
> = {
  '/docs/getting-started': { section: 'get-started', group: 'Overview' },
  '/docs/server-rendering': { section: 'get-started', group: 'Overview' },
  '/docs/accessibility': { section: 'get-started', group: 'Overview' },
  '/docs/ai-agents': { section: 'get-started', group: 'Overview' },
  '/docs/charts': { section: 'charts', group: 'Overview' },
  '/docs/theme-guide': { section: 'theming', group: 'Guides' },
  '/docs/colors': { section: 'theming', group: 'Guides' },
  '/docs/responsive-styles': { section: 'theming', group: 'Guides' },
  '/docs/custom-systems': { section: 'theming', group: 'Guides' },
  '/docs/tailwind': { section: 'theming', group: 'Guides' },
};

const sectionBySlug = new Map<string, DocsSection>();
for (const category of guideCategories) {
  for (const slug of category.slugs.split(' ')) sectionBySlug.set(slug, category.section);
}

/**
 * Find the tab a docs path belongs to, so the header and sidebar agree. A static host may
 * serve a page with a trailing slash, so that slash is ignored.
 */
export function docsSection(path: string): DocsSection {
  const route = path.replace(/(?!^)\/+$/, '');
  const placement = overviewPlacement[route];
  if (placement) return placement.section;
  if (route.startsWith('/docs/theme-variables')) return 'theming';
  if (route.startsWith('/docs/components/') && !route.startsWith(conceptRoutePrefix)) {
    return sectionBySlug.get(route.split('/').at(-1) ?? '') ?? 'components';
  }
  return 'components';
}
