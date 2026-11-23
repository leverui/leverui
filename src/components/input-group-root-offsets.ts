import { type JSX } from '@solidjs/web';
import { readResponsiveCssValues, responsiveBreakpoints } from '../styled-system/responsive-values';
import { numericInputGroupOffset } from './input-group-offset-value';
import type { InputGroupOffset } from './input-group-offset';

type NativeStyle = JSX.HTMLAttributes<HTMLElement>['style'];
type Side = 'start' | 'end';

export interface InputGroupOffsets {
  start?: InputGroupOffset;
  end?: InputGroupOffset;
}

export interface InputGroupRootOffsets {
  attributes: Record<string, string | undefined>;
  variables: Record<string, string>;
}

/** Resolve numeric offsets through CSS spacing tokens with a pixel fallback. */
function offsetLength(value: string | number): string {
  const numeric = numericInputGroupOffset(value);
  if (numeric === undefined) return String(value);
  const absolute = Math.abs(numeric);
  const token = String(absolute).replace('.', '\\.');
  const length = `var(--lui-spacing-${token}, ${absolute}px)`;
  return numeric < 0 ? `calc(-1 * ${length})` : length;
}

/** Carry one active side's offset across supported breakpoints. */
function addSide(result: InputGroupRootOffsets, side: Side, value: InputGroupOffsets[Side]): void {
  if (value === undefined) return;
  const selected = readResponsiveCssValues(value);
  if (!selected) throw new TypeError(`InputGroup ${side} offset uses an unsupported breakpoint.`);
  let current: string | number | undefined;
  for (const breakpoint of responsiveBreakpoints) {
    current = selected[breakpoint] ?? current;
    if (current === undefined) continue;
    const suffix = breakpoint === 'base' ? '' : `-${breakpoint}`;
    result.attributes[`data-group-${side}${suffix}`] = '';
    result.variables[`--lui-private-input-group-${side}-offset${suffix}`] = offsetLength(current);
  }
}

/** Put live element offsets on the group for CSS-first field composition. */
export function inputGroupRootOffsets(offsets: InputGroupOffsets): InputGroupRootOffsets {
  const result: InputGroupRootOffsets = { attributes: {}, variables: {} };
  addSide(result, 'start', offsets.start);
  addSide(result, 'end', offsets.end);
  return result;
}

/** Preserve caller-owned native styles while binding private offset variables. */
export function mergeInputGroupStyle(
  style: NativeStyle,
  variables: Record<string, string>,
): NativeStyle {
  if (Object.keys(variables).length === 0) return style;
  if (typeof style === 'string') {
    const additions = Object.entries(variables)
      .map(
        /** Serialize one validated private custom property. */
        ([name, value]) => `${name}:${value}`,
      )
      .join(';');
    return `${style};${additions}`;
  }
  return { ...style, ...variables };
}
