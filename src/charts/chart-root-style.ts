import { type JSX } from '@solidjs/web';

/** Native style accepted by a chart's outer div. */
export type ChartRootStyle = JSX.HTMLAttributes<HTMLDivElement>['style'];

/** Attach an open numeric chart size without replacing the caller's native style. */
export function chartRootStyle(
  variable: '--leverui-private-radial-chart-size' | '--leverui-private-radial-bar-size',
  size: number | undefined,
  style: ChartRootStyle,
): ChartRootStyle {
  if (size === undefined) return style;
  const declaration = `${variable}:${size}px`;
  if (typeof style === 'string') return `${style};${declaration}`;
  return { ...style, [variable]: `${size}px` };
}
