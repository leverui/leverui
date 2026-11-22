import type { ChartRootStyle } from './chart-root-style';

/** Keep a chart's measured dimension while accepting native caller styles. */
export function radarScatterRootStyle(
  variable: '--leverui-private-radar-chart-width' | '--leverui-private-scatter-chart-height',
  size: number,
  style: ChartRootStyle,
): ChartRootStyle {
  const declaration = `${variable}:${size}px`;
  if (typeof style === 'string') return `${declaration};${style}`;
  return { [variable]: `${size}px`, ...style };
}
