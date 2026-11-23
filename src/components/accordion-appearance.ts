import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['outline', 'subtle', 'enclosed', 'plain'] as const;
export type AccordionSize = (typeof sizes)[number];
export type AccordionVariant = (typeof variants)[number];

export interface AccordionAppearance {
  size?: FiniteResponsiveChoice<AccordionSize> | undefined;
  variant?: FiniteResponsiveChoice<AccordionVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface AccordionAppearanceState {
  unstyled: Accessor<boolean>;
}

type Choice = 'size' | 'variant';
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Attribute =
  `data-${Choice}` | `data-${Choice}-${Breakpoint}` | 'data-lui-color-palette' | 'data-unstyled';
export type AccordionAttributes = Partial<Record<Attribute, string | undefined>>;

const AccordionAppearanceContext = createOptionalContext<AccordionAppearanceState>();

/** Scope the root's unstyled selection to its primitive-owned parts. */
export const AccordionAppearanceProvider = AccordionAppearanceContext;

/** Require the nearest Accordion root before rendering a part. */
export function useAccordionAppearance(): AccordionAppearanceState {
  const state = useOptionalContext(AccordionAppearanceContext);
  if (!state) throw new Error('Accordion parts must be inside AccordionRoot.');
  return state;
}

/** Bind each finite responsive choice to stable native attributes. */
function choiceAttributes<T extends string>(
  name: Choice,
  selected: ResponsiveValues<T>,
): AccordionAttributes {
  return {
    [`data-${name}`]: selected.base,
    [`data-${name}-sm`]: selected.sm,
    [`data-${name}-md`]: selected.md,
    [`data-${name}-lg`]: selected.lg,
    [`data-${name}-xl`]: selected.xl,
    [`data-${name}-2xl`]: selected['2xl'],
  };
}

/** Accept a named or consumer-defined palette without emitting CSS. */
function readPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Accordion colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Reflect validated appearance choices for authored CSS selectors. */
export function accordionAppearanceAttributes(
  appearance: AccordionAppearance,
): AccordionAttributes {
  const size = readFiniteResponsiveChoice(
    appearance.size,
    new Set<string>(sizes),
    'md',
    'Accordion size',
  );
  const variant = readFiniteResponsiveChoice(
    appearance.variant,
    new Set<string>(variants),
    'outline',
    'Accordion variant',
  );
  return {
    ...choiceAttributes('size', size),
    ...choiceAttributes('variant', variant),
    'data-lui-color-palette': readPalette(appearance.colorPalette),
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
