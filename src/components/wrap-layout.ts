import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import { spacingCssValue } from './spacing-css-value';

type WrapString = string | readonly (string | null | undefined)[] | ResponsiveValues<string>;
type WrapSpacing =
  | string
  | number
  | readonly (string | number | null | undefined)[]
  | ResponsiveValues<string | number>;

interface WrapSelection extends LayoutVariable {
  value: ResponsiveValues<string | number>;
}

export interface WrapLayoutProps {
  /** Align items across each flex line. */
  align?: WrapString | undefined;
  /** Distribute items along each flex line. */
  justify?: WrapString | undefined;
  /** Set the flex direction while preserving wrapping. */
  direction?: WrapString | undefined;
  gap?: WrapSpacing | undefined;
  rowGap?: WrapSpacing | undefined;
  columnGap?: WrapSpacing | undefined;
}

const wrapAliases = ['align', 'justify', 'direction'] as const;
const wrapSpacing = ['gap', 'rowGap', 'columnGap'] as const;

/** Preserve ordinary responsive spacing values before token resolution. */
function spacingSelection(
  name: (typeof wrapSpacing)[number],
  value: WrapLayoutProps[(typeof wrapSpacing)[number]],
): WrapSelection | undefined {
  const values = readResponsiveCssValues(value);
  if (!values) return undefined;
  const mapped: Record<string, string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const selected = values[breakpoint];
    if (selected !== undefined) mapped[breakpoint] = spacingCssValue(selected);
  }
  return {
    name: name.replace(
      /[A-Z]/g,
      /** Use kebab case for CSS variable names. */
      (letter) => `-${letter.toLowerCase()}`,
    ),
    value: mapped,
  };
}

/** Keep Wrap aliases and spacing in one native layout selection. */
function wrapSelections(props: WrapLayoutProps): WrapSelection[] | undefined {
  const selections: WrapSelection[] = [];
  for (const name of wrapAliases) {
    const value = readResponsiveCssValues(props[name]);
    if (!value) return undefined;
    selections.push({ name, value });
  }
  for (const name of wrapSpacing) {
    const selection = spacingSelection(name, props[name]);
    if (!selection) return undefined;
    selections.push(selection);
  }
  return selections;
}

/** Mark each explicitly selected property and breakpoint for CSS rules. */
export function wrapLayoutAttributes(props: WrapLayoutProps): Record<string, string> {
  const selections = wrapSelections(props);
  if (!selections) throw new Error('Wrap spacing requires supported breakpoint values.');
  const attributes: Record<string, string> = {};
  for (const { name, value } of selections) {
    let selected = false;
    for (const breakpoint of responsiveBreakpoints) {
      if (value[breakpoint] !== undefined) selected = true;
      if (selected) attributes[`data-wrap-${name}-${breakpoint}`] = '';
    }
  }
  return attributes;
}

/** Emit selected values as private CSS variables on the Wrap root. */
export function wrapVariableStyle(
  props: WrapLayoutProps,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  const selections = wrapSelections(props);
  if (!selections) throw new Error('Wrap spacing requires supported breakpoint values.');
  return layoutVariableStyle('wrap', selections, consumerStyle);
}
