import type { ScatterDatum, ScatterSeries } from '../../src';

/** The twelve temperature and sales samples in the chart. */
export const temperatureData: readonly ScatterDatum[] = [
  { temperature: 14.2, sales: 215 },
  { temperature: 16.4, sales: 325 },
  { temperature: 11.9, sales: 185 },
  { temperature: 15.2, sales: 332 },
  { temperature: 18.5, sales: 406 },
  { temperature: 22.1, sales: 522 },
  { temperature: 19.4, sales: 412 },
  { temperature: 25.1, sales: 614 },
  { temperature: 23.4, sales: 544 },
  { temperature: 18.1, sales: 421 },
  { temperature: 22.6, sales: 445 },
  { temperature: 17.2, sales: 408 },
];

/** Coordinates shared by the legend and connected-dots examples. */
export const groupOne: readonly ScatterDatum[] = [
  { x: 100, y: 200, id: 'group1' },
  { x: 120, y: 100, id: 'group1' },
  { x: 170, y: 300, id: 'group1' },
  { x: 140, y: 250, id: 'group1' },
  { x: 150, y: 400, id: 'group1' },
  { x: 110, y: 280, id: 'group1' },
];

/** The second cluster in the multiple-series example. */
export const groupTwo: readonly ScatterDatum[] = [
  { x: 200, y: 260, id: 'group2' },
  { x: 240, y: 290, id: 'group2' },
  { x: 190, y: 290, id: 'group2' },
  { x: 198, y: 250, id: 'group2' },
  { x: 180, y: 280, id: 'group2' },
  { x: 210, y: 220, id: 'group2' },
];

/** The teal temperature scatter series. */
export const temperatureSeries: readonly ScatterSeries[] = [{ name: 'sales', color: 'teal.solid' }];

/** Two separate color groups for the multiple-series chart. */
export const groupedSeries: readonly ScatterSeries[] = [
  { name: 'Group 1', color: 'blue.solid', groupId: 'group1' },
  { name: 'Group 2', color: 'green.solid', groupId: 'group2' },
];
