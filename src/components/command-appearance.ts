import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const sizes = ['sm', 'md', 'lg'] as const;
const allowedSizes = new Set<string>(sizes);
export type CommandSize = (typeof sizes)[number];

export interface CommandAppearance {
  size?: FiniteResponsiveChoice<CommandSize> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface CommandAppearanceState {
  size: Accessor<ResponsiveValues<CommandSize>>;
  colorPalette: Accessor<string | undefined>;
  unstyled: Accessor<boolean>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
export type CommandAppearanceAttributes = Partial<
  Record<SizeAttribute, CommandSize | undefined> & {
    'data-lui-color-palette': string | undefined;
  }
>;

const AppearanceContext = createOptionalContext<CommandAppearanceState>();

/** Carry finite Command appearance through nested primitive parts. */
export const CommandAppearanceProvider = AppearanceContext;

/** Read the nearest Command root's reactive appearance. */
export function useCommandAppearance(): CommandAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state) throw new Error('Command parts must be inside Command.Root.');
  return state;
}

/** Validate supported responsive Command sizes before CSS selection. */
export function readCommandSize(value: unknown): ResponsiveValues<CommandSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'Command size');
}

/** Accept named or consumer-defined palettes for scoped CSS tokens. */
export function readCommandPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Command colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Reflect finite size and palette choices on native Command parts. */
export function commandAppearanceAttributes(
  state: CommandAppearanceState,
): CommandAppearanceAttributes {
  const size = state.size();
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
    'data-lui-color-palette': state.colorPalette(),
  };
}
