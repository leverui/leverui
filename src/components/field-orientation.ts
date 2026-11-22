import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export type FieldOrientation = 'vertical' | 'horizontal';
const orientations = new Set<string>(['vertical', 'horizontal']);

/** Validate Field orientation and expose finite choices to authored CSS. */
export function fieldOrientationAttributes(value: unknown): {
  'data-orientation': FieldOrientation | undefined;
  'data-orientation-sm': FieldOrientation | undefined;
  'data-orientation-md': FieldOrientation | undefined;
  'data-orientation-lg': FieldOrientation | undefined;
  'data-orientation-xl': FieldOrientation | undefined;
  'data-orientation-2xl': FieldOrientation | undefined;
} {
  const orientation = readFiniteResponsiveChoice(
    value,
    orientations,
    'vertical',
    'Field orientation',
  );
  return {
    'data-orientation': orientation.base,
    'data-orientation-sm': orientation.sm,
    'data-orientation-md': orientation.md,
    'data-orientation-lg': orientation.lg,
    'data-orientation-xl': orientation.xl,
    'data-orientation-2xl': orientation['2xl'],
  };
}
