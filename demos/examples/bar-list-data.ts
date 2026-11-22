import type { BarList } from '../../src';

/** Search source counts used by the Bar List examples. */
export const searchSources: BarList.BarListData[] = [
  { name: 'Google', value: 1200000 },
  { name: 'Direct', value: 100000 },
  { name: 'Bing', value: 200000 },
  { name: 'Yahoo', value: 20000 },
  { name: 'ChatGPT', value: 1345000 },
  { name: 'Github', value: 100000 },
  { name: 'Yandex', value: 100000 },
];

/** Funnel counts used by the formatted and linked examples. */
export const funnelStages: BarList.BarListData[] = [
  { name: 'Created', value: 120, href: '#' },
  { name: 'Initial contact', value: 90, href: '#' },
  { name: 'Booked demo', value: 45, href: '#' },
  { name: 'Closed', value: 10, href: '#' },
];
