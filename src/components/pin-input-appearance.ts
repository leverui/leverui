import {
  readResponsiveBooleans,
  type ResponsiveBooleanValue,
  type ResponsiveBreakpoint,
} from '../styled-system/responsive-values';
import type { InputChoice, InputSize, InputVariant } from './input-appearance-options';

export interface PinInputAppearance {
  size?: InputChoice<InputSize> | undefined;
  variant?: InputChoice<InputVariant> | undefined;
  attached?: ResponsiveBooleanValue | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

type AttachedAttribute = 'data-attached' | `data-attached-${Exclude<ResponsiveBreakpoint, 'base'>}`;

/** Preserve explicit false values when an attached layout changes by breakpoint. */
function attachedValue(value: boolean | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
}

/** Expose finite attached choices to static CSS without affecting Zag state. */
export function pinInputAttachedAttributes(
  value: unknown,
): Partial<Record<AttachedAttribute, string | undefined>> {
  const selected = readResponsiveBooleans(value);
  if (!selected) throw new TypeError('Pin Input attached uses an unsupported breakpoint or value.');
  return {
    'data-attached': attachedValue(selected.base),
    'data-attached-sm': attachedValue(selected.sm),
    'data-attached-md': attachedValue(selected.md),
    'data-attached-lg': attachedValue(selected.lg),
    'data-attached-xl': attachedValue(selected.xl),
    'data-attached-2xl': attachedValue(selected['2xl']),
  };
}
