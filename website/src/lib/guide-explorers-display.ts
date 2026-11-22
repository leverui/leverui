import type { GuideExplorerConfig } from './guide-explorers';
import { lazyExport } from './lazy-export';

/** Explorers for the data-display, typography, and feedback guides. */
export const displayGuideExplorers: Readonly<Record<string, GuideExplorerConfig>> = {
  avatar: {
    name: 'Avatar',
    parts: ['root', 'image', 'fallback'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Avatar guide. */
      () => import('../../../demos/examples/avatar-appearance'),
      'AvatarExplorerDemo',
    ),
  },
  blockquote: {
    name: 'Blockquote',
    parts: ['root', 'icon', 'content', 'caption'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Blockquote guide. */
      () => import('../../../demos/examples/blockquote-standard'),
      'BlockquoteExplorerDemo',
    ),
  },
  card: {
    name: 'Card',
    parts: ['root', 'header', 'body', 'footer', 'title', 'description'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Card guide. */
      () => import('../../../demos/examples/card-guide'),
      'CardExplorerDemo',
    ),
  },
  clipboard: {
    name: 'Clipboard',
    parts: ['root', 'control', 'trigger', 'indicator', 'input', 'label', 'valueText'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Clipboard guide. */
      () => import('../../../demos/examples/clipboard-standard'),
      'ClipboardExplorerDemo',
    ),
  },
  'data-list': {
    name: 'DataList',
    parts: ['root', 'item', 'itemLabel', 'itemValue'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Data List guide. */
      () => import('../../../demos/examples/data-list-display'),
      'DataListBasic',
    ),
  },
  'empty-state': {
    name: 'Empty State',
    parts: ['root', 'content', 'indicator', 'title', 'description'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Empty State guide. */
      () => import('../../../demos/examples/empty-state-standard'),
      'EmptyStateBasic',
    ),
  },
  list: {
    name: 'List',
    parts: ['root', 'item', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the List guide. */
      () => import('../../../demos/examples/list-display'),
      'ListWithIcon',
    ),
  },
  progress: {
    name: 'Progress',
    parts: ['root', 'label', 'track', 'range', 'valueText'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Progress guide. */
      () => import('../../../demos/examples/progress-standard'),
      'ProgressExplorerDemo',
    ),
  },
  'qr-code': {
    name: 'QR Code',
    parts: ['root', 'frame', 'pattern', 'overlay', 'downloadTrigger'],
    Demo: lazyExport(
      /** Load the maintained preview only on the QR Code guide. */
      () => import('../../../demos/examples/qr-code-download'),
      'QrCodeExplorerDemo',
    ),
  },
  stat: {
    name: 'Stat',
    parts: ['root', 'label', 'helpText', 'valueText', 'valueUnit', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Stat guide. */
      () => import('../../../demos/examples/stat-explorer-demo'),
      'StatExplorerDemo',
    ),
  },
  status: {
    name: 'Status',
    parts: ['root', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Status guide. */
      () => import('../../../demos/examples/status-display'),
      'StatusBasic',
    ),
  },
  table: {
    name: 'Table',
    parts: ['root', 'header', 'body', 'row', 'columnHeader', 'cell', 'footer', 'caption'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Table guide. */
      () => import('../../../demos/examples/table-explorer-demo'),
      'TableExplorerDemo',
    ),
  },
  tag: {
    name: 'Tag',
    parts: ['root', 'label', 'closeTrigger', 'startElement', 'endElement'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Tag guide. */
      () => import('../../../demos/examples/tag-composition'),
      'TagExplorerDemo',
    ),
  },
  timeline: {
    name: 'Timeline',
    parts: [
      'root',
      'item',
      'content',
      'separator',
      'indicator',
      'connector',
      'title',
      'description',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Timeline guide. */
      () => import('../../../demos/examples/timeline-basic'),
      'TimelineBasic',
    ),
  },
};
