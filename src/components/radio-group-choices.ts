import type { ResponsiveValues } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';
import type { RadiomarkChoice, RadiomarkSize, RadiomarkVariant } from './radiomark-props';

export const radioGroupSizes = ['xs', 'sm', 'md', 'lg'] as const;
export const radioGroupVariants = ['solid', 'subtle', 'outline'] as const;

export type RadioGroupSize = Extract<RadiomarkSize, (typeof radioGroupSizes)[number]>;
export type RadioGroupVariant = Extract<RadiomarkVariant, (typeof radioGroupVariants)[number]>;
export type RadioGroupChoice<T extends string> = RadiomarkChoice<T>;

export interface RadioGroupChoices {
  size: ResponsiveValues<RadioGroupSize>;
  variant: ResponsiveValues<RadioGroupVariant>;
}

const sizes = new Set<string>(radioGroupSizes);
const variants = new Set<string>(radioGroupVariants);

/** Read the Group's size and treatment independently of the primitive machine state. */
export function readRadioGroupChoices(props: {
  size?: RadioGroupChoice<RadioGroupSize> | undefined;
  variant?: RadioGroupChoice<RadioGroupVariant> | undefined;
}): RadioGroupChoices {
  return {
    size: readFiniteResponsiveChoice(props.size, sizes, 'md', 'Radio Group size'),
    variant: readFiniteResponsiveChoice(props.variant, variants, 'solid', 'Radio Group variant'),
  };
}
