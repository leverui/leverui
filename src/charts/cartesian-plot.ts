import type { CartesianPlot, CartesianPlotMargin } from './cartesian-types';

/** Build a plot with stable margins for ticks and optional axis titles. */
export function cartesianPlot(
  width: number,
  height: number,
  domain: { min: number; max: number },
  showYAxis: boolean,
  xAxisLabel?: string,
  yAxisLabel?: string,
  rightYAxisLabel?: string,
  topInset = 4,
  margin?: CartesianPlotMargin,
  xPadding?: { left?: number; right?: number },
): CartesianPlot {
  if (!Number.isFinite(domain.min) || !Number.isFinite(domain.max) || domain.min >= domain.max) {
    throw new Error('Cartesian chart domain must contain finite values with min below max.');
  }
  for (const value of Object.values(margin ?? {})) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
      throw new Error('Cartesian chart plotMargin values must be finite and nonnegative.');
    }
  }
  for (const value of Object.values(xPadding ?? {})) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
      throw new Error('Cartesian chart xPadding values must be finite and nonnegative.');
    }
  }
  return {
    width,
    height,
    left: margin?.left ?? (showYAxis ? (yAxisLabel ? 76 : 65) : 5),
    right: margin?.right ?? (rightYAxisLabel ? 76 : 6),
    top: margin?.top ?? topInset,
    bottom: margin?.bottom ?? (xAxisLabel ? 54 : 34),
    min: domain.min,
    max: domain.max,
    padLeft: xPadding?.left ?? 0,
    padRight: xPadding?.right ?? 0,
  };
}
