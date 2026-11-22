import { splitProps } from '../primitives/utils/split-props';
import { Tooltip as PrimitiveTooltip } from '../primitives/components/tooltip';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  useTooltipRootProps,
  useTooltipRootProviderProps,
  type TooltipRootProps,
  type TooltipRootProviderProps,
} from './tooltip-props';
import { TooltipAppearanceProvider, type TooltipAppearanceState } from './tooltip-appearance';

type RootInput =
  | { mode: 'root'; props: Omit<TooltipRootProps, 'children'> }
  | { mode: 'provider'; props: Omit<TooltipRootProviderProps, 'children'> };

/** Scope appearance around an owned or caller-owned primitive Tooltip machine. */
function renderTooltipRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(input.props, ['unstyled']);
  const part = input.mode === 'root' ? PrimitiveTooltip.Root : PrimitiveTooltip.RootProvider;
  const appearance: TooltipAppearanceState = {
    /** Follow inherited or explicit unstyled changes through portals. */
    unstyled: () => Boolean(local.unstyled),
    /** Follow the machine label the content may need to carry. */
    ariaLabel: () => ('aria-label' in native ? native['aria-label'] : undefined),
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
    <TooltipAppearanceProvider value={appearance}>
      {createComponent(primitivePart, primitiveProps)}
    </TooltipAppearanceProvider>
  );
}

/** Render a Tooltip with its own primitive state machine. */
export function TooltipRoot(props: TooltipRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const inherited = useTooltipRootProps(instance);
  const native = mergeProps({ lazyMount: true, unmountOnExit: true }, inherited);
  return renderTooltipRoot({ mode: 'root', props: native }, content);
}

/** Render a Tooltip around a caller-owned primitive state accessor. */
export function TooltipRootProvider(props: TooltipRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderTooltipRoot(
    { mode: 'provider', props: useTooltipRootProviderProps(instance) },
    content,
  );
}
