import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type SpacerFlex =
  string | number | readonly (string | number | null)[] | ResponsiveValues<string | number>;

/** Adapt the public flex choice to the shared native variable writer. */
function flexSelection(flex: SpacerFlex | undefined): LayoutVariable {
  return { name: 'flex', value: flex };
}

/** Mark each explicitly selected breakpoint for authored flex rules. */
export function spacerFlexAttributes(flex: SpacerFlex | undefined): Record<string, string> {
  const values = readResponsiveCssValues(flex);
  if (!values) throw new Error('Spacer flex requires supported breakpoint values.');
  const attributes: Record<string, string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    if (values[breakpoint] !== undefined) attributes[`data-spacer-flex-${breakpoint}`] = '';
  }
  return attributes;
}

/** Put selected flex values on the native element without inserting CSS. */
export function spacerVariableStyle(
  flex: SpacerFlex | undefined,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  return layoutVariableStyle('spacer', [flexSelection(flex)], consumerStyle, false);
}
