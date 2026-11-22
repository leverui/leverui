import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const scrollAreaSizes = ['xs', 'sm', 'md', 'lg'] as const;
export const scrollAreaVariants = ['hover', 'always'] as const;
export type ScrollAreaSize = (typeof scrollAreaSizes)[number];
export type ScrollAreaVariant = (typeof scrollAreaVariants)[number];

export interface ScrollAreaAppearance {
  size?: FiniteResponsiveChoice<ScrollAreaSize> | undefined;
  variant?: FiniteResponsiveChoice<ScrollAreaVariant> | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(scrollAreaSizes);
const variants = new Set<string>(scrollAreaVariants);

/** Keep scrollbar sizes on finite authored CSS selectors. */
export function readScrollAreaSizes(value: unknown): ResponsiveValues<ScrollAreaSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Scroll Area size');
}

/** Keep visibility variants on finite authored CSS selectors. */
export function readScrollAreaVariants(value: unknown): ResponsiveValues<ScrollAreaVariant> {
  return readFiniteResponsiveChoice(value, variants, 'hover', 'Scroll Area variant');
}
