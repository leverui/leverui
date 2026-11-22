import { type JSX } from '@solidjs/web';
import { layoutVariableStyle } from '../styled-system/layout-variables';
import { readResponsiveCssValues } from '../styled-system/responsive-values';
import { sizeCssValue } from './size-css-value';
import type { SquareSizeOptions } from './square-size';

/** Expose one effective size at each breakpoint without inserted CSS rules. */
export function squareVariableStyle(
  size: SquareSizeOptions['size'],
  consumerStyle: JSX.HTMLAttributes<HTMLElement>['style'],
): JSX.HTMLAttributes<HTMLElement>['style'] {
  const values = readResponsiveCssValues(size);
  if (!values) throw new Error('Square size requires supported breakpoint values.');
  const mapped: Record<string, string> = {};
  for (const [breakpoint, value] of Object.entries(values)) {
    mapped[breakpoint] = sizeCssValue(value);
  }
  return layoutVariableStyle('square', [{ name: 'size', value: mapped }], consumerStyle);
}
