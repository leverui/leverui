import type { ResponsiveBreakpoint } from '../styled-system/responsive-values';
import type { RadiomarkChoices } from './radiomark-choices';

type ChoiceName = keyof RadiomarkChoices;
type Breakpoint = Exclude<ResponsiveBreakpoint, 'base'>;
type AttributeName = `data-${ChoiceName}` | `data-${ChoiceName}-${Breakpoint}`;

/** Bind finite Radiomark choices to native CSS state hooks. */
export function radiomarkAttributes(
  choices: RadiomarkChoices,
): Partial<Record<AttributeName, string | undefined>> {
  return {
    'data-size': choices.size.base,
    'data-size-sm': choices.size.sm,
    'data-size-md': choices.size.md,
    'data-size-lg': choices.size.lg,
    'data-size-xl': choices.size.xl,
    'data-size-2xl': choices.size['2xl'],
    'data-variant': choices.variant.base,
    'data-variant-sm': choices.variant.sm,
    'data-variant-md': choices.variant.md,
    'data-variant-lg': choices.variant.lg,
    'data-variant-xl': choices.variant.xl,
    'data-variant-2xl': choices.variant['2xl'],
    'data-filled': choices.filled.base ? '' : undefined,
    'data-filled-sm': choices.filled.sm === undefined ? undefined : String(choices.filled.sm),
    'data-filled-md': choices.filled.md === undefined ? undefined : String(choices.filled.md),
    'data-filled-lg': choices.filled.lg === undefined ? undefined : String(choices.filled.lg),
    'data-filled-xl': choices.filled.xl === undefined ? undefined : String(choices.filled.xl),
    'data-filled-2xl':
      choices.filled['2xl'] === undefined ? undefined : String(choices.filled['2xl']),
  };
}
