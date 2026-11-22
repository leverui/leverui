import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const placements = ['bottom', 'bottom-start', 'bottom-end'] as const;
export type ActionBarPlacement = (typeof placements)[number];

export interface ActionBarAppearance {
  placement?: FiniteResponsiveChoice<ActionBarPlacement> | undefined;
  unstyled?: boolean | undefined;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Attribute = 'data-placement' | `data-placement-${Breakpoint}`;
export type ActionBarPlacementAttributes = Partial<Record<Attribute, string | undefined>>;

export interface ActionBarAppearanceState {
  placement: Accessor<ActionBarPlacementAttributes>;
  unstyled: Accessor<boolean>;
}

const ActionBarAppearanceContext = createOptionalContext<ActionBarAppearanceState>();

/** Keep one root's placement and unstyled choices available through portals. */
export const ActionBarAppearanceProvider = ActionBarAppearanceContext;

/** Require the nearest Action Bar root before rendering a part. */
export function useActionBarAppearance(): ActionBarAppearanceState {
  const state = useOptionalContext(ActionBarAppearanceContext);
  if (!state) throw new Error('Action Bar parts must be inside ActionBarRoot.');
  return state;
}

/** Validate a finite placement at each supported breakpoint. */
function readPlacement(
  value: ActionBarAppearance['placement'],
): ResponsiveValues<ActionBarPlacement> {
  return readFiniteResponsiveChoice(
    value,
    new Set<string>(placements),
    'bottom',
    'Action Bar placement',
  );
}

/** Reflect responsive placement through native attributes on the positioner. */
export function actionBarPlacementAttributes(
  value: ActionBarAppearance['placement'],
): ActionBarPlacementAttributes {
  const selected = readPlacement(value);
  return {
    'data-placement': selected.base,
    'data-placement-sm': selected.sm,
    'data-placement-md': selected.md,
    'data-placement-lg': selected.lg,
    'data-placement-xl': selected.xl,
    'data-placement-2xl': selected['2xl'],
  };
}
