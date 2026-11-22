import { type JSX } from '@solidjs/web';
import { layoutVariableStyle } from '../styled-system/layout-variables';
import { readResponsiveCssValues, type ResponsiveValues } from '../styled-system/responsive-values';
import { spacingCssValue } from './spacing-css-value';

export type ResponsiveSpacing =
  string | number | readonly (string | number | null)[] | ResponsiveValues<string | number>;

/** Spacing on each logical edge, with shared axes taking precedence. */
export interface BleedSpacingProps {
  /** Negative margin on both inline edges. */
  inline?: ResponsiveSpacing | undefined;
  /** Negative margin on both block edges. */
  block?: ResponsiveSpacing | undefined;
  /** Negative margin on the logical inline start edge. */
  inlineStart?: ResponsiveSpacing | undefined;
  /** Negative margin on the logical inline end edge. */
  inlineEnd?: ResponsiveSpacing | undefined;
  /** Negative margin on the logical block start edge. */
  blockStart?: ResponsiveSpacing | undefined;
  /** Negative margin on the logical block end edge. */
  blockEnd?: ResponsiveSpacing | undefined;
}

/** Select the effective value for each logical margin. */
function bleedSelections(props: BleedSpacingProps) {
  return [
    { name: 'inline-start', value: props.inline ?? props.inlineStart },
    { name: 'inline-end', value: props.inline ?? props.inlineEnd },
    { name: 'block-start', value: props.block ?? props.blockStart },
    { name: 'block-end', value: props.block ?? props.blockEnd },
  ] as const;
}

/** Resolve ordinary responsive tokens to native variables on the Bleed root. */
export function bleedVariableStyle(
  props: BleedSpacingProps,
  consumerStyle: JSX.HTMLAttributes<HTMLElement>['style'],
): JSX.HTMLAttributes<HTMLElement>['style'] {
  const selections = bleedSelections(props).map(
    /** Set a local zero at every edge so nested Bleed roots do not inherit spacing. */
    ({ name, value }) => {
      const values = readResponsiveCssValues(value);
      if (!values) {
        throw new TypeError(
          `Bleed ${name} requires finite spacing values at base, sm, md, lg, xl, or 2xl.`,
        );
      }
      const mapped: Record<string, string> = { base: '0px' };
      for (const [breakpoint, spacing] of Object.entries(values)) {
        mapped[breakpoint] = spacingCssValue(spacing);
      }
      return { name, value: mapped };
    },
  );
  return layoutVariableStyle('bleed', selections, consumerStyle);
}
