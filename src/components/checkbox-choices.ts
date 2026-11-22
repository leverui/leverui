import { responsiveBreakpoints } from '../styled-system/responsive-values';
import { readCheckmarkChoices, type CheckmarkChoices } from './checkmark-choices';
import { checkmarkSizes } from './checkmark-options';
import type { CheckboxPresentationProps } from './checkbox-root-props';

export const checkboxSizes = checkmarkSizes;
export const checkboxVariants = ['solid', 'outline', 'subtle'] as const;
const variantNames = new Set<string>(checkboxVariants);

/** Validate the finite Checkbox choices while reusing Checkmark's CSS contract. */
export function readCheckboxChoices(
  size: CheckboxPresentationProps['size'],
  variant: CheckboxPresentationProps['variant'],
): CheckmarkChoices {
  const selected = readCheckmarkChoices(size, variant, undefined);
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected.variant[breakpoint];
    if (choice && !variantNames.has(choice)) {
      throw new TypeError(`Checkbox variant is unsupported: ${choice}.`);
    }
  }
  return selected;
}
