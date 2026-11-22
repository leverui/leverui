import {
  readResponsiveBooleans,
  type ResponsiveBooleanValue,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const progressSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const progressVariants = ['outline', 'subtle'] as const;
export const progressShapes = ['square', 'rounded', 'full'] as const;

export type ProgressSize = (typeof progressSizes)[number];
export type ProgressVariant = (typeof progressVariants)[number];
export type ProgressShape = (typeof progressShapes)[number];

export interface ProgressAppearance {
  size?: FiniteResponsiveChoice<ProgressSize> | undefined;
  variant?: FiniteResponsiveChoice<ProgressVariant> | undefined;
  shape?: FiniteResponsiveChoice<ProgressShape> | undefined;
  striped?: ResponsiveBooleanValue | undefined;
  animated?: ResponsiveBooleanValue | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

export interface ProgressChoices {
  size: ResponsiveValues<ProgressSize>;
  variant: ResponsiveValues<ProgressVariant>;
  shape: ResponsiveValues<ProgressShape>;
  striped: ResponsiveValues<boolean>;
  animated: ResponsiveValues<boolean>;
}

const sizes = new Set<string>(progressSizes);
const variants = new Set<string>(progressVariants);
const shapes = new Set<string>(progressShapes);

/** Validate a responsive boolean while retaining explicit false overrides. */
function readBooleanChoice(value: unknown, name: string): ResponsiveValues<boolean> {
  const selected = readResponsiveBooleans(value);
  if (!selected) throw new TypeError(`Progress ${name} has an unsupported breakpoint or value.`);
  return { base: false, ...selected };
}

/** Read the finite appearance choices without touching the Progress machine. */
export function readProgressChoices(appearance: ProgressAppearance): ProgressChoices {
  return {
    size: readFiniteResponsiveChoice(appearance.size, sizes, 'md', 'Progress size'),
    variant: readFiniteResponsiveChoice(
      appearance.variant,
      variants,
      'outline',
      'Progress variant',
    ),
    shape: readFiniteResponsiveChoice(appearance.shape, shapes, 'rounded', 'Progress shape'),
    striped: readBooleanChoice(appearance.striped, 'striped'),
    animated: readBooleanChoice(appearance.animated, 'animated'),
  };
}

/** Accept a named or consumer-defined palette for inherited CSS variables. */
export function readProgressPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Progress colorPalette must be a nonempty string.');
  }
  return value.trim();
}
