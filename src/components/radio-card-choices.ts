import { responsiveBreakpoints, type ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const radioCardSizes = ['sm', 'md', 'lg'] as const;
export const radioCardVariants = ['surface', 'subtle', 'outline', 'solid'] as const;
export const radioCardAlignments = ['start', 'center', 'end'] as const;
export const radioCardOrientations = ['horizontal', 'vertical'] as const;

export type RadioCardSize = (typeof radioCardSizes)[number];
export type RadioCardVariant = (typeof radioCardVariants)[number];
export type RadioCardAlignment = (typeof radioCardAlignments)[number];
export type RadioCardOrientation = (typeof radioCardOrientations)[number];
export type RadioCardChoice<T extends string> = FiniteResponsiveChoice<T>;

export interface RadioCardChoices {
  size: ResponsiveValues<RadioCardSize>;
  variant: ResponsiveValues<RadioCardVariant>;
  align: ResponsiveValues<RadioCardAlignment>;
  justify?: ResponsiveValues<RadioCardAlignment> | undefined;
  orientation: ResponsiveValues<RadioCardOrientation>;
}

const sizes = new Set<string>(radioCardSizes);
const variants = new Set<string>(radioCardVariants);
const alignments = new Set<string>(radioCardAlignments);
const orientations = new Set<string>(radioCardOrientations);

/** Resolve appearance independently of the primitive selection machine. */
export function readRadioCardChoices(props: {
  size?: RadioCardChoice<RadioCardSize> | undefined;
  variant?: RadioCardChoice<RadioCardVariant> | undefined;
  align?: RadioCardChoice<RadioCardAlignment> | undefined;
  justify?: RadioCardChoice<RadioCardAlignment> | undefined;
  orientation?: RadioCardChoice<RadioCardOrientation> | undefined;
}): RadioCardChoices {
  return {
    size: readFiniteResponsiveChoice(props.size, sizes, 'md', 'Radio Card size'),
    variant: readFiniteResponsiveChoice(props.variant, variants, 'outline', 'Radio Card variant'),
    align: readFiniteResponsiveChoice(props.align, alignments, 'start', 'Radio Card align'),
    justify:
      props.justify === undefined
        ? undefined
        : readFiniteResponsiveChoice(props.justify, alignments, 'start', 'Radio Card justify'),
    orientation: readFiniteResponsiveChoice(
      props.orientation,
      orientations,
      'horizontal',
      'Radio Card orientation',
    ),
  };
}

/** Map Card treatments to the shared authored Radiomark treatments. */
export function radioCardMarkVariants(
  choices: RadioCardChoices['variant'],
): ResponsiveValues<'solid' | 'outline' | 'inverted'> {
  const result: ResponsiveValues<'solid' | 'outline' | 'inverted'> = { base: 'solid' };
  for (const breakpoint of responsiveBreakpoints) {
    const variant = choices[breakpoint];
    if (variant === undefined) continue;
    result[breakpoint] =
      variant === 'subtle' ? 'outline' : variant === 'solid' ? 'inverted' : 'solid';
  }
  return result;
}
