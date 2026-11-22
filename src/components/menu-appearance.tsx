import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const menuSizes = ['sm', 'md'] as const;
export type MenuSize = (typeof menuSizes)[number];
export const menuVariants = ['subtle', 'solid'] as const;
export type MenuVariant = (typeof menuVariants)[number];
const allowedSizes = new Set<string>(menuSizes);
const allowedVariants = new Set<string>(menuVariants);

export interface MenuAppearance {
  size?: FiniteResponsiveChoice<MenuSize> | undefined;
  variant?: FiniteResponsiveChoice<MenuVariant> | undefined;
  unstyled?: boolean | undefined;
}

export interface MenuAppearanceState {
  unstyled: Accessor<boolean>;
  size: Accessor<ResponsiveValues<MenuSize>>;
  variant: Accessor<ResponsiveValues<MenuVariant>>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
type VariantAttribute = 'data-variant' | `data-variant-${Breakpoint}`;
export type MenuAppearanceAttributes = Partial<
  Record<SizeAttribute, MenuSize | undefined> & Record<VariantAttribute, MenuVariant | undefined>
>;

const MenuAppearanceContext = createOptionalContext<MenuAppearanceState>();

/** Carry one menu root's presentation choices through Solid portals. */
export const MenuAppearanceProvider = MenuAppearanceContext;

/** Read the nearest menu root's reactive appearance. */
export function useMenuAppearance(): MenuAppearanceState {
  const state = useOptionalContext(MenuAppearanceContext);
  if (!state) throw new Error('Menu parts require MenuRoot or MenuRootProvider.');
  return state;
}

/** Validate the finite menu size at each supported breakpoint. */
export function readMenuSize(value: unknown): ResponsiveValues<MenuSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'Menu size');
}

/** Validate the finite menu variant at each supported breakpoint. */
export function readMenuVariant(value: unknown): ResponsiveValues<MenuVariant> {
  return readFiniteResponsiveChoice(value, allowedVariants, 'subtle', 'Menu variant');
}

/** Reflect responsive choices on a native part outside the root's DOM subtree. */
export function menuAppearanceAttributes(state: MenuAppearanceState): MenuAppearanceAttributes {
  const size = state.size();
  const variant = state.variant();
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
  };
}
