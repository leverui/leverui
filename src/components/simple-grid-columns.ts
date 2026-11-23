import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveInput,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import { sizeCssValue } from './size-css-value';

export type SimpleGridWidth =
  | string
  | number
  | readonly (string | number | null | undefined)[]
  | ResponsiveInput<string | number>;

export type SimpleGridCount =
  number | readonly (number | null | undefined)[] | ResponsiveInput<number>;

/** Map ordinary breakpoint values to CSS grid track expressions. */
function mapTracks(
  value: SimpleGridWidth | SimpleGridCount | undefined,
  transform: (selected: string | number) => string,
): ResponsiveValues<string> {
  const values = readResponsiveCssValues(value);
  if (!values) throw new Error('SimpleGrid requires supported breakpoint values.');
  const tracks: ResponsiveValues<string> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const selected = values[breakpoint];
    if (selected !== undefined) tracks[breakpoint] = transform(selected);
  }
  return tracks;
}

/** Turn each column count into equal-width CSS grid tracks. */
export function countToColumns(columns: SimpleGridCount | undefined): ResponsiveValues<string> {
  return mapTracks(
    columns,
    /** Keep item contents from stretching an equal-width track. */
    (count) => `repeat(${count}, minmax(0, 1fr))`,
  );
}

/** Express a minimum child width with CSS variables so theme overrides stay live. */
export function widthToColumns(width: SimpleGridWidth | undefined): ResponsiveValues<string> {
  return mapTracks(
    width,
    /** Supply a pixel fallback for numeric lengths without a token. */
    (value) => {
      const resolved = sizeCssValue(value);
      const size =
        typeof value === 'number' && value !== 0
          ? `var(--lui-sizes-${value}, ${value}px)`
          : resolved;
      return `repeat(auto-fit, minmax(${size}, 1fr))`;
    },
  );
}
