import { createMemo, type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { DialogRootProps } from './dialog-props';
import { readOverlayChoice } from './overlay-responsive-choice';

type DialogAppearance = Pick<
  DialogRootProps,
  'size' | 'placement' | 'scrollBehavior' | 'motionPreset' | 'unstyled'
>;
export type OverlayFamily = 'dialog' | 'drawer';
interface DialogPartAttributes {
  'data-leverui-dialog-css'?: string | undefined;
  'data-leverui-drawer-css'?: string | undefined;
  'data-size'?: string | undefined;
  'data-size-sm'?: string | undefined;
  'data-size-md-down'?: string | undefined;
  'data-size-md'?: string | undefined;
  'data-size-lg'?: string | undefined;
  'data-size-xl'?: string | undefined;
  'data-size-2xl'?: string | undefined;
  'data-size-sm-down'?: string | undefined;
  'data-size-lg-down'?: string | undefined;
  'data-size-xl-down'?: string | undefined;
  'data-size-2xl-down'?: string | undefined;
  'data-placement'?: string | undefined;
  'data-placement-sm'?: string | undefined;
  'data-placement-md-down'?: string | undefined;
  'data-placement-md'?: string | undefined;
  'data-placement-lg'?: string | undefined;
  'data-placement-xl'?: string | undefined;
  'data-placement-2xl'?: string | undefined;
  'data-placement-sm-down'?: string | undefined;
  'data-placement-lg-down'?: string | undefined;
  'data-placement-xl-down'?: string | undefined;
  'data-placement-2xl-down'?: string | undefined;
  'data-contained'?: string | undefined;
  'data-contained-sm'?: string | undefined;
  'data-contained-md'?: string | undefined;
  'data-contained-lg'?: string | undefined;
  'data-contained-xl'?: string | undefined;
  'data-contained-2xl'?: string | undefined;
  'data-contained-sm-down'?: string | undefined;
  'data-contained-md-down'?: string | undefined;
  'data-contained-lg-down'?: string | undefined;
  'data-contained-xl-down'?: string | undefined;
  'data-contained-2xl-down'?: string | undefined;
  'data-scroll-behavior'?: string | undefined;
  'data-motion-preset'?: string | undefined;
  'data-unstyled'?: string | undefined;
}
const sizes = new Set(['xs', 'sm', 'md', 'lg', 'xl', 'cover', 'full']);
const placements = new Set(['center', 'top', 'bottom']);
const scrollBehaviors = new Set(['inside', 'outside']);
const motionPresets = new Set([
  'scale',
  'slide-in-bottom',
  'slide-in-top',
  'slide-in-left',
  'slide-in-right',
  'none',
]);

export interface DialogAuthoredStyleState {
  family: OverlayFamily;
  usesAuthoredCss: Accessor<boolean>;
  partAttributes: (unstyled?: boolean) => DialogPartAttributes;
}

/** Validate one finite scalar appearance without invoking a styling runtime. */
function readScalarChoice(
  value: unknown,
  allowed: ReadonlySet<string>,
  fallback: string,
  name: string,
): string {
  if (value === undefined) return fallback;
  if (typeof value === 'string' && allowed.has(value)) return value;
  throw new TypeError(`Dialog ${name} must use a supported finite choice.`);
}

const DialogAuthoredStyleContext = createOptionalContext<DialogAuthoredStyleState>();

/** Carry Dialog appearance across its primitive portal without changing machine state. */
export const DialogAuthoredStylesProvider = DialogAuthoredStyleContext;

/** Read the nearest Dialog's authored presentation and part attributes. */
export function useDialogAuthoredStyleState(): DialogAuthoredStyleState {
  const state = useOptionalContext(DialogAuthoredStyleContext);
  if (!state) throw new Error('Dialog parts must be inside DialogRoot or DialogRootProvider.');
  return state;
}

/** Reflect every supported Dialog appearance into authored CSS attributes. */
export function useDialogAuthoredStyles(props: DialogAppearance): DialogAuthoredStyleState {
  const size = createMemo(
    /** Reject invalid scalar, array, or breakpoint sizes at the CSS boundary. */
    () => {
      const choice = readOverlayChoice(props.size, sizes, 'md');
      if (!choice) throw new TypeError('Dialog size must use a supported finite choice.');
      return choice;
    },
  );
  /** All supported Dialog appearances use the authored stylesheet. */
  const usesAuthoredCss: Accessor<boolean> = () => true;

  /** Put the root's appearance choices on each portal-safe native part. */
  function partAttributes(unstyled?: boolean): DialogPartAttributes {
    const bare = Boolean(props.unstyled || unstyled);
    const selectedSize = size();
    return {
      'data-leverui-dialog-css': bare ? undefined : '',
      'data-size': selectedSize?.base,
      'data-size-sm': selectedSize?.sm,
      'data-size-md': selectedSize?.md,
      'data-size-lg': selectedSize?.lg,
      'data-size-xl': selectedSize?.xl,
      'data-size-2xl': selectedSize?.['2xl'],
      'data-size-sm-down': selectedSize?.smDown,
      'data-size-md-down': selectedSize?.mdDown,
      'data-size-lg-down': selectedSize?.lgDown,
      'data-size-xl-down': selectedSize?.xlDown,
      'data-size-2xl-down': selectedSize?.['2xlDown'],
      'data-placement': readScalarChoice(props.placement, placements, 'top', 'placement'),
      'data-scroll-behavior': readScalarChoice(
        props.scrollBehavior,
        scrollBehaviors,
        'outside',
        'scroll behavior',
      ),
      'data-motion-preset': readScalarChoice(props.motionPreset, motionPresets, 'scale', 'motion'),
      'data-unstyled': bare ? '' : undefined,
    };
  }

  return { family: 'dialog', usesAuthoredCss, partAttributes };
}
