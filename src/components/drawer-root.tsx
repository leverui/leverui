import { splitProps } from '../primitives/utils/split-props';
import { Dialog as PrimitiveDialog } from '../primitives/components/dialog';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { DialogAuthoredStylesProvider } from './dialog-authored-style-state';
import { useDrawerAuthoredStyles } from './drawer-authored-style-state';
import {
  useDrawerProps,
  useDrawerProviderProps,
  type DrawerRootProps,
  type DrawerRootProviderProps,
} from './drawer-props';
import { OverlayPortalLifecycle } from './overlay-portal-lifecycle';

type DrawerInput =
  { mode: 'root'; props: DrawerRootProps } | { mode: 'provider'; props: DrawerRootProviderProps };

/** Render finite Drawer choices around the primitive's Dialog machine and presence. */
function renderDrawerRoot(
  input: DrawerInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const [local, machine] = splitProps(props, ['size', 'placement', 'contained', 'unstyled']);
  const authored = useDrawerAuthoredStyles(local);
  const primitiveProps = mergeProps(
    /** Keep controlled machine options and external accessors reactive. */
    () => machine,
    {
      /** Delay content mounting unless explicitly requested otherwise. */
      get lazyMount() {
        return machine.lazyMount ?? true;
      },
      /** Remove content after exit unless explicitly retained. */
      get unmountOnExit() {
        return machine.unmountOnExit ?? true;
      },
      /** Keep Drawer parts inside the primitive's Dialog and presence providers. */
      get children() {
        return (
          <OverlayPortalLifecycle skipAnimationOnMount={machine.skipAnimationOnMount}>
            {content.children}
          </OverlayPortalLifecycle>
        );
      },
    },
  );

  // The discriminated mode selects the primitive's corresponding root contract.
  const primitiveRoot = (
    mode === 'root' ? PrimitiveDialog.Root : PrimitiveDialog.RootProvider
  ) as Component<typeof primitiveProps>;
  return (
    <DialogAuthoredStylesProvider value={authored}>
      {createComponent(primitiveRoot, primitiveProps)}
    </DialogAuthoredStylesProvider>
  );
}

/** Render a Drawer whose primitive Dialog state is owned by this root. */
export function DrawerRoot(props: DrawerRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDrawerRoot({ mode: 'root', props: useDrawerProps(instance) }, content);
}

/** Render a Drawer around a caller-owned primitive Dialog state accessor. */
export function DrawerRootProvider(props: DrawerRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDrawerRoot({ mode: 'provider', props: useDrawerProviderProps(instance) }, content);
}
