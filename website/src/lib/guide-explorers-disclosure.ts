import type { GuideExplorerConfig } from './guide-explorers';
import { lazyExport } from './lazy-export';

/** Explorers for the disclosure and layout guides. */
export const disclosureGuideExplorers: Readonly<Record<string, GuideExplorerConfig>> = {
  breadcrumb: {
    name: 'Breadcrumb',
    parts: ['link', 'currentLink', 'item', 'list', 'root', 'ellipsis', 'separator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Breadcrumb guide. */
      () => import('../../../demos/examples/breadcrumb-standard'),
      'BreadcrumbWithEllipsis',
    ),
  },
  carousel: {
    name: 'Carousel',
    parts: [
      'root',
      'itemGroup',
      'item',
      'control',
      'nextTrigger',
      'prevTrigger',
      'indicatorGroup',
      'indicator',
      'autoplayTrigger',
      'progressText',
      'autoplayIndicator',
    ],
    selectors: {
      autoplayIndicator: '[data-part="autoplay-trigger"] i, [data-part="autoplay-trigger"] svg',
    },
    Demo: lazyExport(
      /** Load the maintained preview only on the Carousel guide. */
      () => import('../../../demos/examples/carousel-autoplay'),
      'CarouselExplorerDemo',
    ),
  },
  collapsible: {
    name: 'Collapsible',
    parts: ['root', 'trigger', 'content', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Collapsible guide. */
      () => import('../../../demos/examples/collapsible-advanced'),
      'CollapsibleInitialOpen',
    ),
  },
  splitter: {
    name: 'Splitter',
    parts: ['root', 'panel', 'resizeTrigger', 'resizeTriggerIndicator', 'resizeTriggerSeparator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Splitter guide. */
      () => import('../../../demos/examples/splitter-simple'),
      'SplitterExplorerDemo',
    ),
  },
  steps: {
    name: 'Steps',
    parts: [
      'root',
      'list',
      'item',
      'trigger',
      'indicator',
      'separator',
      'content',
      'title',
      'description',
      'nextTrigger',
      'prevTrigger',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Steps guide. */
      () => import('../../../demos/examples/steps-explorer-demo'),
      'StepsExplorerDemo',
    ),
  },
  tabs: {
    name: 'Tabs',
    parts: ['root', 'trigger', 'list', 'content', 'contentGroup', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Tabs guide. */
      () => import('../../../demos/examples/tabs-indicator'),
      'TabsExplorerDemo',
    ),
  },
};
