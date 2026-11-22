import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export type StepsSize = 'xs' | 'sm' | 'md' | 'lg';
export type StepsVariant = 'solid' | 'subtle';

export type StepsAppearance = NativeHtmlAliases & {
  size?: FiniteResponsiveChoice<StepsSize> | undefined;
  variant?: FiniteResponsiveChoice<StepsVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
};

const sizes = new Set<string>(['xs', 'sm', 'md', 'lg']);
const variants = new Set<string>(['solid', 'subtle']);

/** Bind a finite responsive choice to one stable attribute per breakpoint. */
function choiceAttributes<T extends string>(
  name: string,
  value: unknown,
  allowed: ReadonlySet<string>,
  fallback: T,
): Record<string, T | undefined> {
  const choice = readFiniteResponsiveChoice(value, allowed, fallback, `Steps ${name}`);
  return {
    [`data-${name}`]: choice.base,
    [`data-${name}-sm`]: choice.sm,
    [`data-${name}-md`]: choice.md,
    [`data-${name}-lg`]: choice.lg,
    [`data-${name}-xl`]: choice.xl,
    [`data-${name}-2xl`]: choice['2xl'],
  };
}

/** Select authored Steps size and treatment rules without inserting CSS. */
export function stepsAppearanceAttributes(
  size: StepsAppearance['size'],
  variant: StepsAppearance['variant'],
): Record<string, string | undefined> {
  return {
    ...choiceAttributes('size', size, sizes, 'md'),
    ...choiceAttributes('variant', variant, variants, 'solid'),
  };
}
