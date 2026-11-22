import type { MenuRootProps as PrimitiveRootProps } from '../primitives/components/menu';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { MenuAppearance } from './menu-appearance';
import type { UseMenuProps, UseMenuReturn } from './menu-machine';
import { mergeRecipeProps } from './recipe-props-merge';

type PresenceProps = Pick<PrimitiveRootProps, keyof UsePresenceProps>;

export type MenuRootBaseProps = UseMenuProps & PresenceProps & MenuAppearance;
export type MenuRootProps = MenuRootBaseProps & { children?: JSX.Element };
export type MenuRootProviderBaseProps = Omit<PresenceProps, 'present'> &
  MenuAppearance & { value: UseMenuReturn };
export type MenuRootProviderProps = MenuRootProviderBaseProps & { children?: JSX.Element };
export type MenuDefaults = Partial<MenuRootBaseProps>;

export interface MenuPropsProviderProps {
  value: MenuDefaults | Accessor<MenuDefaults>;
  children: JSX.Element;
}

const MenuPropsContext = createOptionalContext<Accessor<MenuDefaults>>();
const providerDefaultNames = [
  'size',
  'variant',
  'unstyled',
  'lazyMount',
  'unmountOnExit',
  'onExitComplete',
  'skipAnimationOnMount',
] as const;

/** Retain appearance and presence defaults around a caller-owned menu machine. */
function providerDefaults(defaults: MenuDefaults): Partial<MenuRootProviderBaseProps> {
  const result: Record<string, unknown> = {};
  for (const name of providerDefaultNames) {
    if (name in defaults) result[name] = defaults[name];
  }
  return result as Partial<MenuRootProviderBaseProps>;
}

/** Supply reactive defaults to menu roots in this subtree. */
export function MenuPropsProvider(props: MenuPropsProviderProps): JSX.Element {
  /** Read static defaults or their current Solid accessor value. */
  function readDefaults(): MenuDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <MenuPropsContext value={readDefaults}>{props.children}</MenuPropsContext>;
}

/** Give explicit menu props precedence over inherited defaults. */
export function useMenuRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(MenuPropsContext);
  return mergeRecipeProps<Props>(
    /** Follow provider changes without replacing the primitive's machine. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Keep machine defaults off a caller-owned menu accessor. */
export function useMenuRootProviderProps(
  instance: Omit<MenuRootProviderProps, 'children'>,
): Omit<MenuRootProviderProps, 'children'> {
  const inherited = useOptionalContext(MenuPropsContext);
  return mergeRecipeProps<Omit<MenuRootProviderProps, 'children'>>(
    /** Inherit only appearance and presence options around external state. */
    () => providerDefaults(inherited?.() ?? {}),
    instance,
  );
}
