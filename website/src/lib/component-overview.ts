import { findGuide } from './docs';
import { guideCategories } from './guide-categories';

/** One linked card on the component overview page. */
export interface ComponentOverviewCard {
  readonly title: string;
  readonly href: string;
}

/** Sort by filename, so `checkbox-card` precedes `checkbox`. */
function referenceSortKey(slug: string): string {
  return `${slug}.md`;
}

/** Build the card for one public component guide. */
function overviewCard(slug: string): ComponentOverviewCard {
  const href = `/docs/components/${slug}`;
  const guide = findGuide(href);
  if (!guide) throw new Error(`The component overview lists a missing guide: ${href}`);
  return { title: guide.title, href };
}

/** The guides in the Components sidebar; charts have their own tab and are left out. */
const componentSlugs = guideCategories
  .filter(
    /** Keep the groups shown under the Components tab. */
    (category) => category.section === 'components',
  )
  .flatMap(
    /** Expand one group into its guide slugs. */
    (category) => category.slugs.split(' '),
  );

/** List every component in the Components sidebar in alphabetical order. */
export const componentOverviewCards: readonly ComponentOverviewCard[] = componentSlugs
  .sort(
    /** Compare by code unit, as a file listing does. */
    (first, second) => (referenceSortKey(first) < referenceSortKey(second) ? -1 : 1),
  )
  .map(overviewCard);
