import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

type ResponsivePlacement<Value extends string | number> =
  Value | readonly (Value | null | undefined)[] | ResponsiveValues<Value>;

export interface GridItemPlacement {
  area?: ResponsivePlacement<string> | undefined;
  colSpan?: ResponsivePlacement<number | 'auto'> | undefined;
  colStart?: ResponsivePlacement<number | 'auto'> | undefined;
  colEnd?: ResponsivePlacement<number | 'auto'> | undefined;
  rowStart?: ResponsivePlacement<number | 'auto'> | undefined;
  rowEnd?: ResponsivePlacement<number | 'auto'> | undefined;
  rowSpan?: ResponsivePlacement<number | 'auto'> | undefined;
}

/** Convert a selected track span to CSS grid shorthand. */
function spanValue(value: number | 'auto'): string {
  return value === 'auto' ? value : `span ${value}/span ${value}`;
}

/** Read an ordinary breakpoint selection or report its unsupported shape. */
function placementValues(
  name: string,
  value: unknown,
  span = false,
): ResponsiveValues<string | number> {
  const values = readResponsiveCssValues(value);
  if (!values) throw new Error(`GridItem ${name} requires supported breakpoint values.`);
  if (!span) return values;
  const mapped: ResponsiveValues<string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const selected = values[breakpoint];
    if (selected === undefined) continue;
    if (typeof selected !== 'number' && selected !== 'auto') {
      throw new Error(`GridItem ${name} accepts only numeric spans or "auto".`);
    }
    mapped[breakpoint] = spanValue(selected);
  }
  return mapped;
}

/** Pair each GridItem alias with the corresponding native CSS variable. */
function itemSelections(placement: GridItemPlacement): LayoutVariable[] {
  return [
    { name: 'area', value: placementValues('area', placement.area) },
    { name: 'column', value: placementValues('colSpan', placement.colSpan, true) },
    { name: 'row', value: placementValues('rowSpan', placement.rowSpan, true) },
    { name: 'column-start', value: placementValues('colStart', placement.colStart) },
    { name: 'column-end', value: placementValues('colEnd', placement.colEnd) },
    { name: 'row-start', value: placementValues('rowStart', placement.rowStart) },
    { name: 'row-end', value: placementValues('rowEnd', placement.rowEnd) },
  ];
}

/** Mark only placement aliases explicitly selected at each breakpoint. */
export function gridItemSelectionAttributes(placement: GridItemPlacement): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const { name, value } of itemSelections(placement)) {
    const values = readResponsiveCssValues(value);
    if (!values) throw new Error(`GridItem ${name} requires supported breakpoint values.`);
    for (const breakpoint of responsiveBreakpoints) {
      if (values[breakpoint] !== undefined) attributes[`data-grid-item-${name}-${breakpoint}`] = '';
    }
  }
  return attributes;
}

/** Put item placement values on the element without inserting a CSS rule. */
export function gridItemVariableStyle(
  placement: GridItemPlacement,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  return layoutVariableStyle('grid-item', itemSelections(placement), consumerStyle, false);
}
