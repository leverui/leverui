import { splitProps } from '../primitives/utils/split-props';
import { Popover as PrimitivePopover } from '../primitives/components/popover';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  usePopoverRootProps,
  usePopoverRootProviderProps,
  type PopoverRootProps,
  type PopoverRootProviderProps,
} from './popover-props';
import {
  PopoverAppearanceProvider,
  readPopoverSize,
  type PopoverAppearanceState,
} from './popover-appearance';

type RootInput =
  | { mode: 'root'; props: Omit<PopoverRootProps, 'children'> }
  | { mode: 'provider'; props: Omit<PopoverRootProviderProps, 'children'> };

/** Scope appearance around an owned or caller-owned primitive Popover machine. */
function renderPopoverRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(input.props, ['size', 'unstyled']);
  const part = input.mode === 'root' ? PrimitivePopover.Root : PrimitivePopover.RootProvider;
  const appearance: PopoverAppearanceState = {
    /** Follow inherited or explicit unstyled changes through portals. */
    unstyled: () => Boolean(local.unstyled),
    /** Validate changing size choices before reflecting them in CSS. */
    size: () => readPopoverSize(local.size),
  };
  const primitiveProps = mergeProps(
    /** Keep current machine and presence values reactive. */
    () => native,
    {
      /** Keep parts under the current primitive machine and presence providers. */
      get children() {
        return content.children;
      },
    },
  );

  // The discriminant selects the primitive's matching root contract at this interop boundary.
  const primitivePart = part as Component<typeof primitiveProps>;
  return (
    <PopoverAppearanceProvider value={appearance}>
      {createComponent(primitivePart, primitiveProps)}
    </PopoverAppearanceProvider>
  );
}

/** Render a Popover with its own primitive state machine. */
export function PopoverRoot(props: PopoverRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderPopoverRoot({ mode: 'root', props: usePopoverRootProps(instance) }, content);
}

/** Render a Popover around a caller-owned primitive state accessor. */
export function PopoverRootProvider(props: PopoverRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderPopoverRoot(
    { mode: 'provider', props: usePopoverRootProviderProps(instance) },
    content,
  );
}
