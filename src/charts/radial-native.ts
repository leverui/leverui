import { type JSX } from '@solidjs/web';
import { dispatchChartNativeEvent } from './chart-native-event';

/** Pie and donut options excluded from the native chart root. */
export const radialChartKeys = [
  'data',
  'size',
  'outerRadius',
  'plotOffsetX',
  'innerRadius',
  'startAngle',
  'endAngle',
  'paddingAngle',
  'cornerRadius',
  'stroke',
  'strokeWidth',
  'label',
  'labelFormatter',
  'legend',
  'centerTitle',
  'centerDescription',
  'tooltip',
  'detached',
  'class',
  'className',
  'style',
  'ref',
] as const;

/** Concentric bar options excluded from the native chart root. */
export const radialBarChartKeys = [
  'data',
  'size',
  'innerRadius',
  'barSize',
  'gap',
  'maxValue',
  'label',
  'legend',
  'tooltip',
  'class',
  'className',
  'style',
  'ref',
] as const;

/** Run chart interaction before a consumer's native event handler. */
export function runRadialEvent<E extends Event>(
  event: E & { currentTarget: HTMLDivElement; target: Element },
  internal: (event: E) => void,
  handler: JSX.EventHandlerUnion<HTMLDivElement, E> | undefined,
): void {
  internal(event);
  dispatchChartNativeEvent(handler, event);
}
