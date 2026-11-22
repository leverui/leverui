import type { CartesianChartProps } from './cartesian-types';

/** Resolve a responsive 4:3 SVG height beneath an optional bottom legend. */
export function cartesianSvgHeight(
  width: number,
  options: Pick<CartesianChartProps, 'height' | 'maxHeight' | 'showLegend' | 'legendPlacement'>,
): number {
  if (
    options.maxHeight !== undefined &&
    (!Number.isFinite(options.maxHeight) || options.maxHeight <= 0)
  ) {
    throw new Error('Cartesian chart maxHeight must be positive and finite.');
  }
  if (options.height !== undefined) return options.height;
  const frameHeight = Math.min(options.maxHeight ?? 384, (width * 3) / 4);
  const bottomLegend = options.showLegend && options.legendPlacement !== 'top-right';
  return Math.max(0, frameHeight - (bottomLegend ? 28 : 0));
}
