import { splitProps } from '../primitives/utils/split-props';
import { Dialog as PrimitiveDialog } from '../primitives/components/dialog';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  DialogAuthoredStylesProvider,
  useDialogAuthoredStyles,
} from './dialog-authored-style-state';
import {
  useDialogProps,
  useDialogProviderProps,
  type DialogRootProps,
  type DialogRootProviderProps,
} from './dialog-props';
import { OverlayPortalLifecycle } from './overlay-portal-lifecycle';

type DialogInput =
  { mode: 'root'; props: DialogRootProps } | { mode: 'provider'; props: DialogRootProviderProps };

/** Carry finite Dialog appearance across either primitive root mode and its portal. */
function renderDialogRoot(
  input: DialogInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const [local, machine] = splitProps(props, [
    'size',
    'placement',
    'scrollBehavior',
    'motionPreset',
    'unstyled',
  ]);
  const authored = useDialogAuthoredStyles(local);
  const primitiveProps = mergeProps(
    /** Keep controlled state and machine options reactive. */
    () => machine,
    {
      /** Lazy mount by default while allowing an explicit override. */
      get lazyMount() {
        return machine.lazyMount ?? true;
      },
      /** Remove content after exit unless the consumer chooses otherwise. */
      get unmountOnExit() {
        return machine.unmountOnExit ?? true;
      },
      /** Create parts under the primitive's Dialog and presence providers. */
      get children() {
        return (
          <OverlayPortalLifecycle skipAnimationOnMount={machine.skipAnimationOnMount}>
            {content.children}
          </OverlayPortalLifecycle>
        );
      },
    },
  );

  // The discriminated input preserves the correct root mode at this primitive boundary.
  const primitiveRoot = (
    mode === 'root' ? PrimitiveDialog.Root : PrimitiveDialog.RootProvider
  ) as Component<typeof primitiveProps>;
  return (
    <DialogAuthoredStylesProvider value={authored}>
      {createComponent(primitiveRoot, primitiveProps)}
    </DialogAuthoredStylesProvider>
  );
}

/** Render a Dialog whose state machine is owned by this root. */
export function DialogRoot(props: DialogRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDialogRoot({ mode: 'root', props: useDialogProps(instance) }, content);
}

/** Render a Dialog using a caller-owned primitive state accessor. */
export function DialogRootProvider(props: DialogRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDialogRoot({ mode: 'provider', props: useDialogProviderProps(instance) }, content);
}
