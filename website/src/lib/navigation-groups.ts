import { conceptNavigationTitle, conceptOrderIndex } from './concept-pages';
import { guideIndex } from 'virtual:guide-index';
import { docsSection, docsTabs, overviewPlacement, type DocsSection } from './docs-sections';
import type { GuideMeta } from './guide-meta';
import { categoryForGuide, guideCategories, isListedGuide } from './guide-categories';
import { navigationTitle } from './navigation-titles';

/** One titled list of links in the sidebar. */
export interface NavigationGroup {
  readonly name: string;
  readonly links: readonly { readonly path: string; readonly label: string }[];
}

/** Link a guide with its sidebar label. */
function linkFor(guide: GuideMeta): { path: string; label: string } {
  return {
    path: guide.path,
    label:
      guide.kind === 'concept'
        ? conceptNavigationTitle(guide.path, guide.title)
        : navigationTitle(guide.path, guide.title),
  };
}

/** Build the Components > Concepts group in sidebar order. */
function conceptGroup(): NavigationGroup {
  const concepts = guideIndex
    .filter(
      /** Keep the concept pages. */
      (guide) => guide.kind === 'concept',
    )
    .sort(
      /** Follow the concept order. */
      (first, second) => conceptOrderIndex(first.path) - conceptOrderIndex(second.path),
    );
  return { name: 'Concepts', links: concepts.map(linkFor) };
}

/** Build the component or chart groups for one tab, in each group's listed order. */
function categoryGroups(section: DocsSection): NavigationGroup[] {
  return guideCategories
    .filter(
      /** Keep the groups that belong to this tab. */
      (category) => category.section === section,
    )
    .map(
      /** Collect one group's guides in its listed order. */
      (category) => {
        const order = category.slugs.split(' ');
        const members = guideIndex
          .filter(
            /** Keep this group's listed component guides. */
            (guide) =>
              guide.kind === 'component' &&
              isListedGuide(guide) &&
              categoryForGuide(guide) === category.name,
          )
          .sort(
            /** Follow the group's listed order. */
            (first, second) =>
              order.indexOf(first.path.split('/').at(-1) ?? '') -
              order.indexOf(second.path.split('/').at(-1) ?? ''),
          );
        return { name: category.name, links: members.map(linkFor) };
      },
    );
}

/** Shorten a theme variable page's title to its token label, such as "Colors". */
function tokenLink(guide: GuideMeta): { path: string; label: string } {
  if (guide.path === '/docs/theme-variables') return { path: guide.path, label: 'Overview' };
  const label = guide.title
    .replace(/ variables/, '')
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
  return { path: guide.path, label };
}

/** Build the written-guide groups for one tab in the listed order, then its theme variable pages. */
function writtenGroups(section: DocsSection): NavigationGroup[] {
  const groups = new Map<string, NavigationGroup['links'][number][]>();
  for (const [path, placement] of Object.entries(overviewPlacement)) {
    const guide = guideIndex.find(
      /** Find the written guide at this path. */
      (candidate) => candidate.path === path,
    );
    if (!guide || placement.section !== section) continue;
    groups.set(placement.group, [...(groups.get(placement.group) ?? []), linkFor(guide)]);
  }
  // The written theming guides come before the Design Tokens reference.
  if (section === 'theming') {
    const tokens = guideIndex
      .filter(
        /** Keep the generated theme variable pages. */
        (guide) => guide.kind === 'reference',
      )
      .map(tokenLink)
      .sort(
        /** Put the overview first, then the token pages alphabetically. */
        (first, second) =>
          Number(second.label === 'Overview') - Number(first.label === 'Overview') ||
          first.label.localeCompare(second.label),
      );
    groups.set('Design Tokens', tokens);
  }
  return [...groups].map(
    /** Turn one map entry into a sidebar group. */
    ([name, links]) => ({ name, links }),
  );
}

/** Join groups that share a name, keeping the order in which each name first appears. */
function mergeGroups(groups: readonly NavigationGroup[]): NavigationGroup[] {
  const merged = new Map<string, NavigationGroup['links'][number][]>();
  for (const group of groups) {
    merged.set(group.name, [...(merged.get(group.name) ?? []), ...group.links]);
  }
  return [...merged].map(
    /** Turn one map entry into a sidebar group. */
    ([name, links]) => ({ name, links }),
  );
}

/** List the sidebar groups for the tab that owns the current page. */
export function sectionGroups(section: DocsSection): NavigationGroup[] {
  if (section === 'components') return [conceptGroup(), ...categoryGroups('components')];
  if (section === 'charts') {
    return mergeGroups([...writtenGroups('charts'), ...categoryGroups('charts')]);
  }
  return writtenGroups(section);
}

/** Every sidebar link in reading order, tab by tab, as the Previous and Next links follow. */
export const sidebarPages: readonly NavigationGroup['links'][number][] = docsTabs.flatMap(
  /** Flatten one tab's groups into its links. */
  (tab) =>
    sectionGroups(tab.section).flatMap(
      /** List one group's links. */
      (group) => group.links,
    ),
);

/** List the sidebar groups for the tab that owns a page. */
export function groupsForPath(path: string): NavigationGroup[] {
  return sectionGroups(docsSection(path));
}
