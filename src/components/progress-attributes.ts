import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readProgressChoices,
  readProgressPalette,
  type ProgressAppearance,
} from './progress-choices';

type Choice = 'size' | 'variant' | 'shape' | 'striped' | 'animated';
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Attribute =
  | `data-${Choice}`
  | `data-${Choice}-${Breakpoint}`
  | 'data-leverui-color-palette'
  | 'data-unstyled';
export type ProgressAttributes = Partial<Record<Attribute, string | undefined>>;

/** Reflect one finite choice at the six supported CSS breakpoints. */
function choiceAttributes(
  name: Choice,
  selected: ResponsiveValues<string | boolean>,
): ProgressAttributes {
  return {
    [`data-${name}`]: selected.base?.toString(),
    [`data-${name}-sm`]: selected.sm?.toString(),
    [`data-${name}-md`]: selected.md?.toString(),
    [`data-${name}-lg`]: selected.lg?.toString(),
    [`data-${name}-xl`]: selected.xl?.toString(),
    [`data-${name}-2xl`]: selected['2xl']?.toString(),
  };
}

/** Bind appearance to native root attributes for authored CSS. */
export function progressAttributes(appearance: ProgressAppearance): ProgressAttributes {
  const choices = readProgressChoices(appearance);
  return {
    ...choiceAttributes('size', choices.size),
    ...choiceAttributes('variant', choices.variant),
    ...choiceAttributes('shape', choices.shape),
    ...choiceAttributes('striped', choices.striped),
    ...choiceAttributes('animated', choices.animated),
    'data-leverui-color-palette': readProgressPalette(appearance.colorPalette),
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
