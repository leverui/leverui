import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const editableSizes = ['sm', 'md', 'lg'] as const;
export type EditableSize = (typeof editableSizes)[number];

export interface EditableAppearance {
  size?: FiniteResponsiveChoice<EditableSize> | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(editableSizes);

/** Validate responsive Editable sizes before binding authored CSS selectors. */
export function readEditableSizes(value: unknown): ResponsiveValues<EditableSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Editable size');
}
