import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import { sizeCssValue } from './size-css-value';

type FlexString = string | readonly (string | null | undefined)[] | ResponsiveValues<string>;
type FlexNumber =
  | string
  | number
  | readonly (string | number | null | undefined)[]
  | ResponsiveValues<string | number>;

interface FlexSelection extends LayoutVariable {
  value: ResponsiveValues<string | number>;
}

export interface FlexLayoutProps {
  align?: FlexString | undefined;
  justify?: FlexString | undefined;
  wrap?: FlexString | undefined;
  direction?: FlexString | undefined;
  basis?: FlexNumber | undefined;
  grow?: FlexNumber | undefined;
  shrink?: FlexNumber | undefined;
  inline?: boolean | undefined;
}

const flexAliases = ['align', 'justify', 'wrap', 'direction', 'basis', 'grow', 'shrink'] as const;

/** Keep Flex basis tokens distinct from scalar flex factors. */
function basisValues(values: ResponsiveValues<string | number>): ResponsiveValues<string> {
  const mapped: ResponsiveValues<string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const value = values[breakpoint];
    if (value !== undefined) mapped[breakpoint] = sizeCssValue(value);
  }
  return mapped;
}

/** Translate Flex layout aliases into supported breakpoint values. */
function flexSelections(props: FlexLayoutProps): FlexSelection[] {
  const selections: FlexSelection[] = [];
  for (const alias of flexAliases) {
    const values = readResponsiveCssValues(props[alias]);
    if (!values) throw new Error(`Flex ${alias} requires supported breakpoint values.`);
    selections.push({ name: alias, value: alias === 'basis' ? basisValues(values) : values });
  }
  return selections;
}

/** Add live alias values as private CSS variables on one Flex element. */
export function flexVariableStyle(
  props: FlexLayoutProps,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  return layoutVariableStyle('flex', flexSelections(props), consumerStyle);
}
