import { classValueString, type ClassValue } from '../utils/class-value';
export type BarListPart =
  | 'root'
  | 'content'
  | 'title'
  | 'label'
  | 'labelHeading'
  | 'bar'
  | 'row'
  | 'fill'
  | 'rowLabel'
  | 'value'
  | 'valueRow'
  | 'tooltip';

/** Keep every Bar List part targetable by one stable consumer CSS hook. */
export function barListClass(part: BarListPart, consumer?: ClassValue): string {
  const base = `leverui-bar-list__${part}`;
  const consumerClass = classValueString(consumer);
  return consumerClass ? `${base} ${consumerClass}` : base;
}
