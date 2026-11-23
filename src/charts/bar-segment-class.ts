import { classValueString, type ClassValue } from '../utils/class-value';
export type BarSegmentPart =
  | 'root'
  | 'content'
  | 'label'
  | 'labelItem'
  | 'value'
  | 'valueItem'
  | 'legend'
  | 'legendItem'
  | 'legendSwatch'
  | 'legendText'
  | 'legendPercent'
  | 'bar'
  | 'segment'
  | 'tooltip'
  | 'tooltipSwatch'
  | 'reference'
  | 'referenceLine'
  | 'referenceLabel';

/** Compose a stable Bar Segment hook with a caller class. */
export function barSegmentClass(part: BarSegmentPart, consumer?: ClassValue): string {
  const base = `lui-bar-segment__${part}`;
  const consumerClass = classValueString(consumer);
  return consumerClass ? `${base} ${consumerClass}` : base;
}
