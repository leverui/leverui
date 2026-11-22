import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { DialogRootProps as PrimitiveDialogRootProps } from '../primitives/components/dialog';
import type { UseDialogProps, UseDialogReturn } from './dialog-machine';
import type { OverlayBreakpoint } from './overlay-responsive-choice';
import { mergeRecipeProps } from './recipe-props-merge';

type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'cover' | 'full';
type DialogResponsiveSize =
  | DialogSize
  | readonly (DialogSize | null | undefined)[]
  | Partial<Record<OverlayBreakpoint, DialogSize | undefined>>;
type DialogAppearanceProps = {
  size?: DialogResponsiveSize | undefined;
  placement?: 'center' | 'top' | 'bottom' | undefined;
  scrollBehavior?: 'inside' | 'outside' | undefined;
  motionPreset?:
    | 'scale'
    | 'slide-in-bottom'
    | 'slide-in-top'
    | 'slide-in-left'
    | 'slide-in-right'
    | 'none'
    | undefined;
  unstyled?: boolean | undefined;
};
type DialogRenderProps = Pick<
  PrimitiveDialogRootProps,
  'lazyMount' | 'unmountOnExit' | 'onExitComplete' | 'skipAnimationOnMount'
>;

export type DialogRootProps = UseDialogProps &
  DialogRenderProps &
  DialogAppearanceProps & { children?: JSX.Element };
export type DialogRootProviderProps = {
  value: UseDialogReturn;
  children?: JSX.Element;
} & DialogRenderProps &
  DialogAppearanceProps;
export type DialogDefaults = Partial<Omit<DialogRootProps, 'children'>>;

export interface DialogPropsProviderProps {
  value: DialogDefaults | Accessor<DialogDefaults>;
  children: JSX.Element;
}

const DialogPropsContext = createOptionalContext<Accessor<DialogDefaults>>();
const providerDefaultNames = [
  'size',
  'placement',
  'scrollBehavior',
  'motionPreset',
  'unstyled',
  'lazyMount',
  'unmountOnExit',
  'onExitComplete',
  'skipAnimationOnMount',
] as const;

/** Keep appearance and presence defaults while an external accessor owns Dialog state. */
function providerDefaults(defaults: DialogDefaults): Partial<DialogRootProviderProps> {
  const result: Record<string, unknown> = {};
  for (const name of providerDefaultNames) {
    if (name in defaults) result[name] = defaults[name];
  }
  return result as Partial<DialogRootProviderProps>;
}

/** Supply reactive Dialog defaults without owning an instance's state. */
export function DialogPropsProvider(props: DialogPropsProviderProps): JSX.Element {
  /** Read the current defaults from a static object or Solid accessor. */
  function readDefaults(): DialogDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <DialogPropsContext value={readDefaults}>{props.children}</DialogPropsContext>;
}

/** Give instance Dialog props precedence over the nearest defaults. */
export function useDialogProps(instance: DialogRootProps): DialogRootProps {
  const inherited = useOptionalContext(DialogPropsContext);
  return mergeRecipeProps<DialogRootProps>(
    /** Follow changing provider defaults while the Dialog remains mounted. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Merge inherited appearance and presence defaults into a caller-owned Dialog. */
export function useDialogProviderProps(instance: DialogRootProviderProps): DialogRootProviderProps {
  const inherited = useOptionalContext(DialogPropsContext);
  return mergeRecipeProps<DialogRootProviderProps>(
    /** Leave the external dialog accessor in control of machine options. */
    () => providerDefaults(inherited?.() ?? {}),
    instance,
  );
}
