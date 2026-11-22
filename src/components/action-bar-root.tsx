import { splitProps } from '../primitives/utils/split-props';
import { Popover as PrimitivePopover } from '../primitives/components/popover';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  ActionBarAppearanceProvider,
  actionBarPlacementAttributes,
  type ActionBarAppearanceState,
} from './action-bar-appearance';
import {
  useActionBarRootProps,
  useActionBarRootProviderProps,
  type ActionBarRootProps,
  type ActionBarRootProviderProps,
} from './action-bar-props';

type RootInput =
  | { mode: 'root'; props: Omit<ActionBarRootProps, 'children'> }
  | { mode: 'provider'; props: Omit<ActionBarRootProviderProps, 'children'> };

/** Scope finite appearance around either primitive Popover root mode. */
function renderActionBarRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(input.props, ['placement', 'unstyled']);
  const part = input.mode === 'root' ? PrimitivePopover.Root : PrimitivePopover.RootProvider;
  const appearance: ActionBarAppearanceState = {
    /** Follow placement changes without remounting the Popover machine. */
    placement: () => actionBarPlacementAttributes(local.placement),
    /** Suppress authored part presentation under an unstyled root. */
    unstyled: () => Boolean(local.unstyled),
  };
  const rootDefaults =
    input.mode === 'root'
      ? {
          /** Leave selection controls focused when the Action Bar opens. */
          get autoFocus() {
            return input.props.autoFocus ?? false;
          },
        }
      : {};
  const primitiveProps = mergeProps(
    /** Keep the machine and presence props reactive. */
    () => native,
    rootDefaults,
    {
      /** Mount content only after the bar opens unless overridden. */
      get lazyMount() {
        return input.props.lazyMount ?? true;
      },
      /** Remove closed content after its exit unless overridden. */
      get unmountOnExit() {
        return input.props.unmountOnExit ?? true;
      },
      /** Render portal-safe parts under the primitive's state and presence providers. */
      get children() {
        return content.children;
      },
    },
  );

  return (
    <ActionBarAppearanceProvider value={appearance}>
      {/* The primitive's separate root signatures meet at the machine boundary. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </ActionBarAppearanceProvider>
  );
}

/** Render a selection-controlled Action Bar with its own primitive machine. */
export function ActionBarRoot(props: ActionBarRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderActionBarRoot({ mode: 'root', props: useActionBarRootProps(instance) }, content);
}

/** Render a caller-owned Popover machine as an Action Bar. */
export function ActionBarRootProvider(props: ActionBarRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderActionBarRoot(
    { mode: 'provider', props: useActionBarRootProviderProps(instance) },
    content,
  );
}
