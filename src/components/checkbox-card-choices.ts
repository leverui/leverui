import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const checkboxCardSizes = ['sm', 'md', 'lg'] as const;
export const checkboxCardVariants = ['surface', 'subtle', 'outline', 'solid'] as const;
export const checkboxCardAlignments = ['start', 'center', 'end'] as const;
export const checkboxCardOrientations = ['horizontal', 'vertical'] as const;

export type CheckboxCardSize = (typeof checkboxCardSizes)[number];
export type CheckboxCardVariant = (typeof checkboxCardVariants)[number];
export type CheckboxCardAlignment = (typeof checkboxCardAlignments)[number];
export type CheckboxCardOrientation = (typeof checkboxCardOrientations)[number];
export type CheckboxCardChoice<T extends string> = FiniteResponsiveChoice<T>;

export interface CheckboxCardChoices {
  size: ResponsiveValues<CheckboxCardSize>;
  variant: ResponsiveValues<CheckboxCardVariant>;
  align: ResponsiveValues<CheckboxCardAlignment>;
  justify?: ResponsiveValues<CheckboxCardAlignment> | undefined;
  orientation: ResponsiveValues<CheckboxCardOrientation>;
}

const sizes = new Set<string>(checkboxCardSizes);
const variants = new Set<string>(checkboxCardVariants);
const alignments = new Set<string>(checkboxCardAlignments);
const orientations = new Set<string>(checkboxCardOrientations);

/** Resolve the Card's presentation choices without involving its primitive machine. */
export function readCheckboxCardChoices(props: {
  size?: CheckboxCardChoice<CheckboxCardSize> | undefined;
  variant?: CheckboxCardChoice<CheckboxCardVariant> | undefined;
  align?: CheckboxCardChoice<CheckboxCardAlignment> | undefined;
  justify?: CheckboxCardChoice<CheckboxCardAlignment> | undefined;
  orientation?: CheckboxCardChoice<CheckboxCardOrientation> | undefined;
}): CheckboxCardChoices {
  return {
    size: readFiniteResponsiveChoice(props.size, sizes, 'md', 'Checkbox Card size'),
    variant: readFiniteResponsiveChoice(
      props.variant,
      variants,
      'outline',
      'Checkbox Card variant',
    ),
    align: readFiniteResponsiveChoice(props.align, alignments, 'start', 'Checkbox Card align'),
    justify:
      props.justify === undefined
        ? undefined
        : readFiniteResponsiveChoice(props.justify, alignments, 'start', 'Checkbox Card justify'),
    orientation: readFiniteResponsiveChoice(
      props.orientation,
      orientations,
      'horizontal',
      'Checkbox Card orientation',
    ),
  };
}
