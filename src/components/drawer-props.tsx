import type { DialogRootProps as PrimitiveDialogRootProps } from '../primitives/components/dialog';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { UseDrawerProps, UseDrawerReturn } from './drawer-machine';
import type { OverlayBreakpoint } from './overlay-responsive-choice';
import { mergeRecipeProps } from './recipe-props-merge';

type DrawerResponsiveChoice<T extends string | boolean> =
  T | readonly (T | null | undefined)[] | Partial<Record<OverlayBreakpoint, T | undefined>>;
type DrawerAppearanceProps = {
  size?: DrawerResponsiveChoice<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'> | undefined;
  placement?: DrawerResponsiveChoice<'start' | 'end' | 'top' | 'bottom'> | undefined;
  contained?: DrawerResponsiveChoice<boolean> | undefined;
  unstyled?: boolean | undefined;
};
type DrawerRenderProps = Pick<
  PrimitiveDialogRootProps,
  'lazyMount' | 'unmountOnExit' | 'onExitComplete' | 'skipAnimationOnMount'
>;

export type DrawerRootProps = UseDrawerProps &
  DrawerRenderProps &
  DrawerAppearanceProps & { children?: JSX.Element };
export type DrawerRootProviderProps = {
  value: UseDrawerReturn;
  children?: JSX.Element;
} & DrawerRenderProps &
  DrawerAppearanceProps;
export type DrawerDefaults = Partial<Omit<DrawerRootProps, 'children'>>;

export interface DrawerRootPropsProviderProps {
  value: DrawerDefaults | Accessor<DrawerDefaults>;
  children: JSX.Element;
}

const DrawerPropsContext = createOptionalContext<Accessor<DrawerDefaults>>();
const providerDefaultNames = [
  'size',
  'placement',
  'contained',
  'unstyled',
  'lazyMount',
  'unmountOnExit',
  'onExitComplete',
  'skipAnimationOnMount',
] as const;

/** Keep styling and presence defaults separate from an external Dialog machine. */
function providerDefaults(defaults: DrawerDefaults): Partial<DrawerRootProviderProps> {
  const result: Record<string, unknown> = {};
  for (const name of providerDefaultNames) {
    if (name in defaults) result[name] = defaults[name];
  }
  return result as Partial<DrawerRootProviderProps>;
}

/** Supply reactive Drawer defaults without owning a machine instance. */
export function DrawerRootPropsProvider(props: DrawerRootPropsProviderProps): JSX.Element {
  /** Read the nearest changing Drawer defaults when a root requests them. */
  function readDefaults(): DrawerDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <DrawerPropsContext value={readDefaults}>{props.children}</DrawerPropsContext>;
}

/** Give explicit Drawer root props precedence over inherited defaults. */
export function useDrawerProps(instance: DrawerRootProps): DrawerRootProps {
  const inherited = useOptionalContext(DrawerPropsContext);
  return mergeRecipeProps<DrawerRootProps>(
    /** Follow provider defaults without replacing the machine. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Inherit only appearance and presence defaults under an external machine. */
export function useDrawerProviderProps(instance: DrawerRootProviderProps): DrawerRootProviderProps {
  const inherited = useOptionalContext(DrawerPropsContext);
  return mergeRecipeProps<DrawerRootProviderProps>(
    /** Preserve the external accessor's machine configuration. */
    () => providerDefaults(inherited?.() ?? {}),
    instance,
  );
}
