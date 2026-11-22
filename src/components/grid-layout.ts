import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import { sizeCssValue } from './size-css-value';

type GridString = string | readonly (string | null | undefined)[] | ResponsiveValues<string>;
type GridTrack =
  | string
  | number
  | readonly (string | number | null | undefined)[]
  | ResponsiveValues<string | number>;

export interface GridOptions {
  templateColumns?: GridTrack | undefined;
  autoFlow?: GridString | undefined;
  autoRows?: GridTrack | undefined;
  autoColumns?: GridTrack | undefined;
  templateRows?: GridTrack | undefined;
  templateAreas?: GridString | undefined;
  column?: GridString | undefined;
  row?: GridString | undefined;
  inline?: boolean | undefined;
}

const gridAliases = [
  ['templateColumns', 'template-columns'],
  ['autoFlow', 'auto-flow'],
  ['autoRows', 'auto-rows'],
  ['autoColumns', 'auto-columns'],
  ['templateRows', 'template-rows'],
  ['templateAreas', 'template-areas'],
  ['column', 'column'],
  ['row', 'row'],
] as const;

/** Resolve size tokens in track values without changing compound CSS syntax. */
function trackValues(values: ResponsiveValues<string | number>): ResponsiveValues<string> {
  const mapped: ResponsiveValues<string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const value = values[breakpoint];
    if (value !== undefined) mapped[breakpoint] = sizeCssValue(value);
  }
  return mapped;
}

/** Pair each Grid alias with its current native CSS variable selection. */
function gridSelections(props: GridOptions): LayoutVariable[] {
  const selections: LayoutVariable[] = [];
  for (const [alias, name] of gridAliases) {
    const values = readResponsiveCssValues(props[alias]);
    if (!values) throw new Error(`Grid ${alias} requires supported breakpoint values.`);
    const isTrack =
      alias === 'templateColumns' ||
      alias === 'templateRows' ||
      alias === 'autoRows' ||
      alias === 'autoColumns';
    selections.push({ name, value: isTrack ? trackValues(values) : values });
  }
  return selections;
}

/** Write Grid aliases as native CSS variables on their own element. */
export function gridVariableStyle(
  props: GridOptions,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  return layoutVariableStyle('grid', gridSelections(props), consumerStyle);
}
