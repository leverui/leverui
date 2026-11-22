import { barMaximum } from './bar-geometry';
import type { BarChartProps } from './bar-chart-types';
import { validateBarOptions } from './bar-validation';
import type { CartesianPlot } from './cartesian-types';

/** Derive a responsive 4:3 chart frame and validated Bar Chart plot domain. */
export function barChartPlot(props: BarChartProps, width: number): CartesianPlot {
  validateBarOptions(props);
  const [min, max] = props.yDomain ?? [0, props.percent ? 1 : barMaximum(props.data, props.series)];
  if (![min, max].every(Number.isFinite) || min >= max) {
    throw new Error('Bar chart domain must contain finite increasing bounds.');
  }
  const height = props.height ?? Math.min(props.maxHeight ?? 384, (width * 3) / 4);
  const top = props.topInset ?? 5;
  const bottom =
    props.bottomInset ?? (props.showLegend && props.legendPlacement !== 'top-right' ? 63 : 35);
  if (
    !Number.isFinite(height) ||
    !Number.isFinite(top) ||
    !Number.isFinite(bottom) ||
    top < 0 ||
    bottom < 0 ||
    height <= top + bottom
  ) {
    throw new Error('Bar chart height must leave room for axes and bars.');
  }
  const left =
    props.leftInset ?? (props.showYAxis === false || props.yAxisPlacement === 'right' ? 5 : 65);
  const right =
    props.rightInset ??
    (props.showLegend && props.legendPlacement === 'top-right'
      ? 100
      : props.yAxisPlacement === 'right'
        ? 65
        : 6);
  if (width <= left + right) {
    throw new Error('Bar chart width must leave room for its side insets.');
  }
  return { width, height, left, right, top, bottom, min, max };
}
