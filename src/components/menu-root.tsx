import { splitProps } from '../primitives/utils/split-props';
import { Menu as PrimitiveMenu } from '../primitives/components/menu';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  useMenuRootProps,
  useMenuRootProviderProps,
  type MenuRootProps,
  type MenuRootProviderProps,
} from './menu-props';
import {
  MenuAppearanceProvider,
  readMenuSize,
  readMenuVariant,
  type MenuAppearanceState,
} from './menu-appearance';

type RootInput =
  | { mode: 'root'; props: Omit<MenuRootProps, 'children'> }
  | { mode: 'provider'; props: Omit<MenuRootProviderProps, 'children'> };

/** Scope menu appearance around an owned or caller-owned primitive machine. */
function renderMenuRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, rest] = splitProps(input.props, ['size', 'variant', 'unstyled']);
  const size = createMemo(
    /** Revalidate only when this root's inherited or explicit size changes. */
    () => readMenuSize(local.size),
  );
  const variant = createMemo(
    /** Revalidate only when this root's inherited or explicit variant changes. */
    () => readMenuVariant(local.variant),
  );
  const appearance: MenuAppearanceState = {
    /** Follow inherited or explicit unstyled changes through portals. */
    unstyled: () => Boolean(local.unstyled),
    size,
    variant,
  };
  const part = input.mode === 'root' ? PrimitiveMenu.Root : PrimitiveMenu.RootProvider;
  const primitiveProps = mergeProps(
    /** Forward current machine and presence options after appearance extraction. */
    () => rest,
    {
      /** Apply lazy presence defaults only to a machine-owning root. */
      get lazyMount() {
        return rest.lazyMount ?? (input.mode === 'root' ? true : undefined);
      },
      /** Leave external-machine presence mounted unless requested otherwise. */
      get unmountOnExit() {
        return rest.unmountOnExit ?? (input.mode === 'root' ? true : undefined);
      },
      /** Keep the primitive parts under their machine and appearance providers. */
      get children() {
        return content.children;
      },
    },
  );

  // The discriminant selects the primitive's matching root contract at this boundary.
  const primitivePart = part as Component<typeof primitiveProps>;
  return (
    <MenuAppearanceProvider value={appearance}>
      {createComponent(primitivePart, primitiveProps)}
    </MenuAppearanceProvider>
  );
}

/** Render a menu with a primitive state machine owned by this root. */
export function MenuRoot(props: MenuRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderMenuRoot({ mode: 'root', props: useMenuRootProps(instance) }, content);
}

/** Render a menu around a caller-owned primitive state accessor. */
export function MenuRootProvider(props: MenuRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderMenuRoot({ mode: 'provider', props: useMenuRootProviderProps(instance) }, content);
}
