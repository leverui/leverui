import { type JSX } from '@solidjs/web';
import { layoutVariableStyle } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type ResponsiveRatio = number | readonly (number | null)[] | ResponsiveValues<number>;

const ratioError = 'AspectRatio ratio requires positive finite numbers at ordinary breakpoints.';

/** Convert supported positive ratios into spacer percentages at each breakpoint. */
export function ratioPadding(value: ResponsiveRatio): ResponsiveValues<string> {
  const values = readResponsiveCssValues(value);
  if (!values) throw new TypeError(ratioError);
  const padding: ResponsiveValues<string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const ratio = values[breakpoint];
    if (ratio === undefined) continue;
    if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio <= 0) {
      throw new TypeError(ratioError);
    }
    padding[breakpoint] = `${(1 / ratio) * 100}%`;
  }
  return padding;
}

/** Merge responsive spacer variables with the caller's native style. */
export function aspectRatioVariableStyle(
  padding: ResponsiveValues<string>,
  consumerStyle: JSX.HTMLAttributes<HTMLElement>['style'],
): JSX.HTMLAttributes<HTMLElement>['style'] {
  return layoutVariableStyle('aspect-ratio', [{ name: 'padding', value: padding }], consumerStyle);
}
