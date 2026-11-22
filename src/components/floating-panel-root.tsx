import { splitProps } from '../primitives/utils/split-props';
import { FloatingPanel as PrimitiveFloatingPanel } from '../primitives/components/floating-panel';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  useFloatingPanelRootProps,
  useFloatingPanelRootProviderProps,
  type FloatingPanelRootProps,
  type FloatingPanelRootProviderProps,
} from './floating-panel-props';
import { FloatingPanelStylesProvider } from './floating-panel-styles';

type RootInput =
  | { mode: 'root'; props: Omit<FloatingPanelRootProps, 'children'> }
  | { mode: 'provider'; props: Omit<FloatingPanelRootProviderProps, 'children'> };

const minimumSize = { width: 240, height: 100 } as const;

/** Scope the authored CSS choice around an owned or caller-owned primitive machine. */
function renderFloatingPanelRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, rest] = splitProps(input.props, ['unstyled']);
  /** Keep the root's presentation choice reactive through the primitive portals. */
  function readUnstyled(): boolean {
    return Boolean(local.unstyled);
  }
  const part =
    input.mode === 'root' ? PrimitiveFloatingPanel.Root : PrimitiveFloatingPanel.RootProvider;
  const rootDefaults =
    input.mode === 'root'
      ? {
          /** Keep the default minimum panel dimensions unless overridden. */
          get minSize() {
            return input.props.minSize ?? minimumSize;
          },
          /** Mount panel content on first open by default. */
          get lazyMount() {
            return input.props.lazyMount ?? true;
          },
          /** Remove panel content after its exit by default. */
          get unmountOnExit() {
            return input.props.unmountOnExit ?? true;
          },
        }
      : {};
  const primitiveProps = mergeProps(
    /** Forward current machine and presence values after appearance extraction. */
    () => rest,
    rootDefaults,
    {
      /** Keep the primitive parts under their machine and appearance providers. */
      get children() {
        return content.children;
      },
    },
  );

  // The discriminated input selects the primitive's matching root contract.
  const primitivePart = part as Component<typeof primitiveProps>;
  return (
    <FloatingPanelStylesProvider value={readUnstyled}>
      {createComponent(primitivePart, primitiveProps)}
    </FloatingPanelStylesProvider>
  );
}

/** Render a Floating Panel with its own primitive state machine. */
export function FloatingPanelRoot(props: FloatingPanelRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderFloatingPanelRoot(
    { mode: 'root', props: useFloatingPanelRootProps(instance) },
    content,
  );
}

/** Render a Floating Panel around a caller-owned primitive state accessor. */
export function FloatingPanelRootProvider(props: FloatingPanelRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderFloatingPanelRoot(
    { mode: 'provider', props: useFloatingPanelRootProviderProps(instance) },
    content,
  );
}
