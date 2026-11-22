import { readFiniteResponsiveChoice } from './finite-responsive-choice';
import {
  buttonSizes,
  buttonVariants,
  type ButtonAppearance,
  type ButtonSize,
  type ButtonVariant,
} from './button-appearance';

const sizes = new Set<string>(buttonSizes);
const variants = new Set<string>(buttonVariants);

/** Reflect supported Button choices for authored CSS breakpoint rules. */
export function buttonAttributes(props: ButtonAppearance): Record<string, string | undefined> {
  const size = readFiniteResponsiveChoice<ButtonSize>(props.size, sizes, 'md', 'Button size');
  const variant = readFiniteResponsiveChoice<ButtonVariant>(
    props.variant,
    variants,
    'solid',
    'Button variant',
  );
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
    'data-variant': variant.base,
    'data-variant-sm': variant.sm,
    'data-variant-md': variant.md,
    'data-variant-lg': variant.lg,
    'data-variant-xl': variant.xl,
    'data-variant-2xl': variant['2xl'],
    'data-leverui-color-palette': props.colorPalette,
  };
}
