import { type JSX } from '@solidjs/web';
import { layoutVariableStyle, type LayoutVariable } from '../styled-system/layout-variables';
import {
  readResponsiveCssValues,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type FloatPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'top-end'
  | 'top-start'
  | 'bottom-center'
  | 'top-center'
  | 'middle-center'
  | 'middle-end'
  | 'middle-start';

export type FloatPlacementValue =
  | FloatPlacement
  | readonly (FloatPlacement | null | undefined)[]
  | ResponsiveValues<FloatPlacement>;

export type FloatOffset =
  | string
  | number
  | readonly (string | number | null | undefined)[]
  | ResponsiveValues<string | number>;

export interface FloatOptions {
  /** Set the shared edge offset when an axis override is absent. */
  offset?: FloatOffset | undefined;
  /** Override the horizontal edge offset. */
  offsetX?: FloatOffset | undefined;
  /** Override the vertical edge offset. */
  offsetY?: FloatOffset | undefined;
  /** Choose an edge or midpoint of the positioned parent. */
  placement?: FloatPlacementValue | undefined;
  /** Keep native semantics while suppressing decorative styling. */
  unstyled?: boolean | undefined;
}

const placements = new Set<FloatPlacement>([
  'bottom-end',
  'bottom-start',
  'top-end',
  'top-start',
  'bottom-center',
  'top-center',
  'middle-center',
  'middle-end',
  'middle-start',
]);

/** Expose the effective placement at each authored breakpoint. */
export function floatPlacementAttributes(
  placement: FloatPlacementValue | undefined,
): Record<string, string> {
  const values = readResponsiveStrings(placement);
  if (
    !values ||
    Object.values(values).some(
      /** Reject unsupported placement strings at the runtime boundary. */
      (value) => !placements.has(value as FloatPlacement),
    )
  ) {
    throw new Error('Float placement requires supported positions and breakpoints.');
  }
  const attributes: Record<string, string> = {};
  let current: FloatPlacement = 'top-end';
  for (const breakpoint of responsiveBreakpoints) {
    current = (values[breakpoint] as FloatPlacement | undefined) ?? current;
    attributes[`data-placement-${breakpoint}`] = current;
  }
  return attributes;
}

/** Resolve spacing tokens without treating CSS lengths as theme names. */
function offsetCssValue(value: string | number): string {
  const text = String(value);
  if (text === '0') return '0px';
  if (/^-?\d+(?:\.\d+)?$/.test(text)) {
    const negative = text.startsWith('-');
    const token = `var(--leverui-spacing-${text.replace('-', '').replace('.', '\\.')})`;
    return negative ? `calc(-1 * ${token})` : token;
  }
  return text;
}

/** Let an axis override take precedence over the shared offset at each breakpoint. */
function axisOffsets(
  shared: ResponsiveValues<string | number>,
  override: ResponsiveValues<string | number>,
): ResponsiveValues<string> {
  const values: ResponsiveValues<string> = {};
  let sharedValue: string | number | undefined;
  let axisValue: string | number | undefined;
  for (const breakpoint of responsiveBreakpoints) {
    sharedValue = shared[breakpoint] ?? sharedValue;
    axisValue = override[breakpoint] ?? axisValue;
    const effective = axisValue ?? sharedValue;
    if (effective !== undefined) values[breakpoint] = offsetCssValue(effective);
  }
  return values;
}

/** Write responsive offsets as native variables without inserting CSS rules. */
export function floatVariableStyle(
  options: Pick<FloatOptions, 'offset' | 'offsetX' | 'offsetY'>,
  consumerStyle: JSX.HTMLAttributes<HTMLElement>['style'],
): JSX.HTMLAttributes<HTMLElement>['style'] {
  const shared = readResponsiveCssValues(options.offset);
  const x = readResponsiveCssValues(options.offsetX);
  const y = readResponsiveCssValues(options.offsetY);
  if (!shared || !x || !y) throw new Error('Float offsets require supported breakpoint values.');
  const selections: LayoutVariable[] = [
    { name: 'x', value: axisOffsets(shared, x) },
    { name: 'y', value: axisOffsets(shared, y) },
  ];
  return layoutVariableStyle('float', selections, consumerStyle);
}
