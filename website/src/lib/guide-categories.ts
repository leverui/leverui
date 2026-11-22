import type { GuideMeta } from './guide-meta';

/** Visitor-facing component groups. */
export const guideCategories = [
  {
    name: 'Layout',
    section: 'components',
    slugs:
      'aspect-ratio bleed box absolute-center center container flex float grid group scroll-area separator simple-grid splitter stack wrap',
  },
  {
    name: 'Typography',
    section: 'components',
    slugs:
      'blockquote code code-block em heading highlight kbd link link-overlay list mark prose text',
  },
  {
    name: 'Buttons',
    section: 'components',
    slugs: 'button close-button icon-button download-trigger',
  },
  {
    name: 'Date and Time',
    section: 'components',
    slugs: 'date-input date-picker calendar',
  },
  {
    name: 'Forms',
    section: 'components',
    slugs:
      'checkbox checkbox-card color-picker color-swatch editable field fieldset file-upload input number-input password-input pin-input radio-card radio rating segmented-control native-select switch slider textarea tags-input',
  },
  {
    name: 'Collections',
    section: 'components',
    slugs: 'combobox command listbox select tree-view',
  },
  {
    name: 'Overlays',
    section: 'components',
    slugs:
      'action-bar dialog drawer floating-panel hover-card menu overlay-manager popover toggle-tip tooltip',
  },
  {
    name: 'Disclosure',
    section: 'components',
    slugs: 'accordion breadcrumb carousel collapsible pagination steps tabs',
  },
  {
    name: 'Feedback',
    section: 'components',
    slugs: 'alert empty-state progress-circle progress skeleton spinner status toast',
  },
  {
    name: 'Data Display',
    section: 'components',
    slugs:
      'avatar badge card clipboard image data-list icon marquee qr-code stat table tag timeline',
  },
  {
    name: 'Internationalization',
    section: 'components',
    slugs: 'locale-provider format-number format-byte',
  },
  {
    name: 'Utilities',
    section: 'components',
    slugs:
      'checkmark client-only environment-provider for presence portal radiomark show skip-nav visually-hidden theme',
  },
  {
    name: 'Overview',
    section: 'charts',
    slugs: 'use-chart axes cartesian-grid',
  },
  {
    name: 'Charts',
    section: 'charts',
    slugs:
      'area-chart bar-chart bar-list bar-segment donut-chart line-chart pie-chart radar-chart scatter-chart sparkline',
  },
] as const;

export type GuideCategory = (typeof guideCategories)[number]['name'];

const categoryBySlug = new Map<string, GuideCategory>();
for (const category of guideCategories) {
  for (const slug of category.slugs.split(' ')) categoryBySlug.set(slug, category.name);
}

/** Locate a component guide in the public documentation taxonomy. */
export function categoryForGuide(guide: GuideMeta): GuideCategory {
  const slug = guide.path.split('/').at(-1) ?? '';
  return categoryBySlug.get(slug) ?? 'Utilities';
}

/** List only the guides that belong to a catalog group. */
export function isListedGuide(guide: GuideMeta): boolean {
  return categoryBySlug.has(guide.path.split('/').at(-1) ?? '');
}
