import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { readResponsiveStrings, type ResponsiveCssValue } from '../styled-system/responsive-values';
import { inputAppearanceAttributes } from './input-appearance-attributes';
import type { InputVariant } from './input-appearance-options';

export const numberInputSizes = ['xs', 'sm', 'md', 'lg'] as const;
export type NumberInputSize = (typeof numberInputSizes)[number];
export type NumberInputVariant = InputVariant;
export type NumberInputChoice<T extends string> = ResponsiveCssValue<T>;

export interface NumberInputAppearance {
  size?: NumberInputChoice<NumberInputSize> | undefined;
  variant?: NumberInputChoice<NumberInputVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface NumberInputAppearanceState {
  attributes: Accessor<ReturnType<typeof inputAppearanceAttributes>>;
  unstyled: Accessor<boolean>;
}

const NumberInputAppearanceContext = createOptionalContext<NumberInputAppearanceState>();
/** Scope appearance choices to the primitive's numeric parts. */
export const NumberInputAppearanceProvider = NumberInputAppearanceContext;

/** Reject Input sizes that have no matching Number Input stepper geometry. */
function validateSize(size: NumberInputAppearance['size']): void {
  const values = readResponsiveStrings(size);
  if (!values) throw new TypeError('NumberInput size uses an unsupported breakpoint or value.');
  for (const value of Object.values(values)) {
    if (
      value !== undefined &&
      !numberInputSizes.some(
        /** Match one finite stepper size. */
        (option) => option === value,
      )
    ) {
      throw new TypeError(`NumberInput size is unsupported: ${value}.`);
    }
  }
}

/** Bind root and field to the same finite, responsive Input appearance. */
export function numberInputAppearanceAttributes(
  appearance: NumberInputAppearance,
): ReturnType<typeof inputAppearanceAttributes> {
  validateSize(appearance.size);
  return inputAppearanceAttributes(appearance.size, appearance.variant, 'NumberInput');
}

/** Require the nearest numeric root before rendering a styled part. */
export function useNumberInputAppearance(): NumberInputAppearanceState {
  const state = useOptionalContext(NumberInputAppearanceContext);
  if (!state) throw new Error('Number Input parts must be inside NumberInputRoot.');
  return state;
}
