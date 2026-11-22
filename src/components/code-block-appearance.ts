import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const sizes = ['sm', 'md', 'lg'] as const;
export type CodeBlockSize = (typeof sizes)[number];
export interface CodeBlockAppearance {
  size?: FiniteResponsiveChoice<CodeBlockSize> | undefined;
  unstyled?: boolean | undefined;
}
export interface CodeBlockAppearanceState {
  unstyled: Accessor<boolean>;
}

const AppearanceContext = createOptionalContext<CodeBlockAppearanceState>();

/** Scope unstyled presentation to the nearest Code Block root. */
export const CodeBlockAppearanceProvider = AppearanceContext;

/** Read the nearest root's presentation state for a compound part. */
export function useCodeBlockAppearance(): CodeBlockAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state) throw new Error('Code Block parts must be inside CodeBlockRoot.');
  return state;
}

/** Validate finite responsive sizes and reflect them for authored CSS. */
export function codeBlockSizeAttributes(
  size: CodeBlockAppearance['size'],
): Record<string, string | undefined> {
  const selected = readFiniteResponsiveChoice(
    size,
    new Set<string>(sizes),
    'md',
    'Code Block size',
  );
  return {
    'data-size': selected.base,
    'data-size-sm': selected.sm,
    'data-size-md': selected.md,
    'data-size-lg': selected.lg,
    'data-size-xl': selected.xl,
    'data-size-2xl': selected['2xl'],
  };
}
