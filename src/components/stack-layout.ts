import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import { spacingCssValue } from './spacing-css-value';

type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type ResponsiveString = string | readonly (string | null | undefined)[] | ResponsiveValues<string>;
export type StackDirection =
  Direction | readonly (Direction | null | undefined)[] | ResponsiveValues<Direction>;
export type StackGap =
  | string
  | number
  | readonly (string | number | null | undefined)[]
  | ResponsiveValues<string | number>;

export interface StackLayoutProps {
  align?: ResponsiveString | undefined;
  justify?: ResponsiveString | undefined;
  wrap?: ResponsiveString | undefined;
  direction?: StackDirection | undefined;
  gap?: StackGap | undefined;
}

/** Keep breakpoint choices while resolving their spacing tokens. */
function gapValues(value: StackGap | undefined): ResponsiveValues<string> {
  const values = readResponsiveCssValues(value);
  if (!values) throw new Error('Stack gap requires supported breakpoint values.');
  const mapped: ResponsiveValues<string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const selected = values[breakpoint];
    if (selected !== undefined) mapped[breakpoint] = spacingCssValue(selected);
  }
  return mapped;
}

/** Normalize a Stack alias to supported breakpoint selections. */
function selectionValues(name: string, value: unknown): ResponsiveValues<string | number> {
  const selected = readResponsiveCssValues(value);
  if (!selected) throw new Error(`Stack ${name} requires supported breakpoint values.`);
  return selected;
}

/** Build responsive CSS variables for Stack layout and separator spacing. */
function stackSelections(props: StackLayoutProps, hasSeparator: boolean): LayoutVariable[] {
  const gap = gapValues(props.gap);
  return [
    { name: 'direction', value: selectionValues('direction', props.direction ?? 'column') },
    { name: 'align', value: selectionValues('align', props.align) },
    { name: 'justify', value: selectionValues('justify', props.justify) },
    { name: 'wrap', value: selectionValues('wrap', props.wrap) },
    { name: 'gap', value: { base: '0.5rem', ...gap } },
    { name: 'render-gap', value: hasSeparator ? 'normal' : { base: '0.5rem', ...gap } },
  ];
}

/** Emit the current Stack layout values as private native CSS variables. */
export function stackVariableStyle(
  props: StackLayoutProps,
  hasSeparator: boolean,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  return layoutVariableStyle('stack', stackSelections(props, hasSeparator), consumerStyle);
}

/** Expose the effective direction at every ordinary breakpoint for separators. */
export function stackDirectionAttributes(
  direction: StackDirection | undefined,
): Record<string, string> {
  const selected = readResponsiveStrings(direction ?? 'column');
  if (!selected) throw new Error('Stack direction requires supported breakpoint values.');
  const attributes: Record<string, string> = {};
  let current = 'column';
  for (const breakpoint of responsiveBreakpoints) {
    current = selected[breakpoint] ?? current;
    if (!['row', 'row-reverse', 'column', 'column-reverse'].includes(current)) {
      throw new Error('Stack direction must be a row or column direction.');
    }
    attributes[`data-direction-${breakpoint}`] = current;
  }
  return attributes;
}
