import { splitProps } from '../primitives/utils/split-props';
import { HoverCard as PrimitiveHoverCard } from '../primitives/components/hover-card';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  useHoverCardRootProps,
  useHoverCardRootProviderProps,
  type HoverCardRootProps,
  type HoverCardRootProviderProps,
} from './hover-card-props';
import {
  HoverCardAppearanceProvider,
  type HoverCardAppearanceState,
} from './hover-card-appearance';
import { readHoverCardSize } from './hover-card-appearance';

type RootInput =
  | { mode: 'root'; props: Omit<HoverCardRootProps, 'children'> }
  | { mode: 'provider'; props: Omit<HoverCardRootProviderProps, 'children'> };

/** Scope appearance around an owned or caller-owned primitive HoverCard machine. */
function renderHoverCardRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(input.props, ['size', 'unstyled']);
  const part = input.mode === 'root' ? PrimitiveHoverCard.Root : PrimitiveHoverCard.RootProvider;
  const appearance: HoverCardAppearanceState = {
    /** Follow inherited or explicit unstyled changes through portals. */
    unstyled: () => Boolean(local.unstyled),
    /** Validate changing size choices before reflecting them in CSS. */
    size: () => readHoverCardSize(local.size),
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
    <HoverCardAppearanceProvider value={appearance}>
      {createComponent(primitivePart, primitiveProps)}
    </HoverCardAppearanceProvider>
  );
}

/** Render a HoverCard with its own primitive state machine. */
export function HoverCardRoot(props: HoverCardRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderHoverCardRoot({ mode: 'root', props: useHoverCardRootProps(instance) }, content);
}

/** Render a HoverCard around a caller-owned primitive state accessor. */
export function HoverCardRootProvider(props: HoverCardRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderHoverCardRoot(
    { mode: 'provider', props: useHoverCardRootProviderProps(instance) },
    content,
  );
}
