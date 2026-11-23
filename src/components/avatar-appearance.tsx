import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import {
  readResponsiveBooleans,
  type ResponsiveBooleanValue,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const avatarSizes = ['full', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export const avatarVariants = ['solid', 'subtle', 'outline'] as const;
const shapes = ['square', 'rounded', 'full'] as const;
const allowedSizes = new Set<string>(avatarSizes);
const allowedVariants = new Set<string>(avatarVariants);
const allowedShapes = new Set<string>(shapes);

export type AvatarSize = (typeof avatarSizes)[number];
export type AvatarVariant = (typeof avatarVariants)[number];
export type AvatarShape = (typeof shapes)[number];

export interface AvatarAppearance {
  size?: FiniteResponsiveChoice<AvatarSize> | undefined;
  variant?: FiniteResponsiveChoice<AvatarVariant> | undefined;
  shape?: FiniteResponsiveChoice<AvatarShape> | undefined;
  borderless?: ResponsiveBooleanValue | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface AvatarAppearanceState {
  unstyled: Accessor<boolean>;
}

type Choice = 'size' | 'variant' | 'shape';
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Attribute =
  | `data-${Choice}`
  | `data-${Choice}-${Breakpoint}`
  | 'data-lui-color-palette'
  | 'data-borderless'
  | `data-borderless-${Breakpoint}`
  | 'data-unstyled';
export type AvatarAttributes = Partial<Record<Attribute, string | undefined>>;

const AvatarAppearanceContext = createOptionalContext<AvatarAppearanceState>();

/** Scope the root's unstyled choice to its image and fallback. */
export const AvatarAppearanceProvider = AvatarAppearanceContext;

/** Require a matching root before rendering an Avatar part. */
export function useAvatarAppearance(): AvatarAppearanceState {
  const state = useOptionalContext(AvatarAppearanceContext);
  if (!state) throw new Error('Avatar parts must be inside AvatarRoot.');
  return state;
}

/** Bind a finite choice at every supported CSS breakpoint. */
function choiceAttributes<T extends string>(
  name: Choice,
  selected: ResponsiveValues<T>,
): AvatarAttributes {
  return {
    [`data-${name}`]: selected.base,
    [`data-${name}-sm`]: selected.sm,
    [`data-${name}-md`]: selected.md,
    [`data-${name}-lg`]: selected.lg,
    [`data-${name}-xl`]: selected.xl,
    [`data-${name}-2xl`]: selected['2xl'],
  };
}

/** Validate a named or consumer-defined palette without inserting CSS. */
function readPalette(value: unknown): string {
  if (value === undefined) return 'gray';
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Avatar colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Validate boolean group-border choices at ordinary breakpoints. */
function borderlessAttributes(value: unknown): AvatarAttributes {
  const selected = readResponsiveBooleans(value);
  if (!selected) throw new TypeError('Avatar borderless has an unsupported breakpoint or value.');
  return {
    'data-borderless': String(selected.base ?? false),
    'data-borderless-sm': selected.sm === undefined ? undefined : String(selected.sm),
    'data-borderless-md': selected.md === undefined ? undefined : String(selected.md),
    'data-borderless-lg': selected.lg === undefined ? undefined : String(selected.lg),
    'data-borderless-xl': selected.xl === undefined ? undefined : String(selected.xl),
    'data-borderless-2xl': selected['2xl'] === undefined ? undefined : String(selected['2xl']),
  };
}

/** Reflect Avatar choices as stable attributes for authored CSS. */
export function avatarAppearanceAttributes(appearance: AvatarAppearance): AvatarAttributes {
  const size = readFiniteResponsiveChoice(appearance.size, allowedSizes, 'md', 'Avatar size');
  const variant = readFiniteResponsiveChoice(
    appearance.variant,
    allowedVariants,
    'subtle',
    'Avatar variant',
  );
  const shape = readFiniteResponsiveChoice(appearance.shape, allowedShapes, 'full', 'Avatar shape');
  return {
    ...choiceAttributes('size', size),
    ...choiceAttributes('variant', variant),
    ...choiceAttributes('shape', shape),
    ...borderlessAttributes(appearance.borderless),
    'data-lui-color-palette': readPalette(appearance.colorPalette),
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
