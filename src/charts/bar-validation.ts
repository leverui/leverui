import type { BarChartProps } from './bar-chart-types';

/** Reject options that cannot produce finite, accessible bar geometry. */
export function validateBarOptions(props: BarChartProps): void {
  const categoryGap = props.categoryGap ?? 0.2;
  if (!Number.isFinite(categoryGap) || categoryGap < 0 || categoryGap >= 1) {
    throw new Error('Bar chart categoryGap must be between zero and one.');
  }
  const barGap = props.barGap ?? 4;
  if (!Number.isFinite(barGap) || barGap < 0) {
    throw new Error('Bar chart barGap must be a nonnegative finite number.');
  }
  if (props.barSize !== undefined && (!Number.isFinite(props.barSize) || props.barSize <= 0)) {
    throw new Error('Bar chart barSize must be a positive finite number.');
  }
  if (
    props.maxHeight !== undefined &&
    (!Number.isFinite(props.maxHeight) || props.maxHeight <= 0)
  ) {
    throw new Error('Bar chart maxHeight must be a positive finite number.');
  }
  if (props.leftInset !== undefined && (!Number.isFinite(props.leftInset) || props.leftInset < 0)) {
    throw new Error('Bar chart leftInset must be nonnegative and finite.');
  }
  if (
    props.rightInset !== undefined &&
    (!Number.isFinite(props.rightInset) || props.rightInset < 0)
  ) {
    throw new Error('Bar chart rightInset must be nonnegative and finite.');
  }
  for (const tick of props.yTickValues ?? []) {
    if (!Number.isFinite(tick)) {
      throw new Error('Bar chart yTickValues must contain only finite numbers.');
    }
  }
  if (
    props.xTickEvery !== undefined &&
    (!Number.isInteger(props.xTickEvery) || props.xTickEvery <= 0)
  ) {
    throw new Error('Bar chart xTickEvery must be a positive integer.');
  }
  for (const series of props.series) {
    if (typeof series.label === 'object') {
      for (const offset of [series.label.positiveOffset, series.label.negativeOffset]) {
        if (offset !== undefined && (!Number.isFinite(offset) || offset < 0)) {
          throw new Error(
            `Bar chart label offset for ${series.name} must be nonnegative and finite.`,
          );
        }
      }
    }
    if (series.radius !== undefined && (!Number.isFinite(series.radius) || series.radius < 0)) {
      throw new Error(`Bar chart radius for ${series.name} must be nonnegative and finite.`);
    }
    if (
      series.fillOpacity !== undefined &&
      (!Number.isFinite(series.fillOpacity) || series.fillOpacity < 0 || series.fillOpacity > 1)
    ) {
      throw new Error(`Bar chart fillOpacity for ${series.name} must be between zero and one.`);
    }
  }
}
