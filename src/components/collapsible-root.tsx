import { splitProps } from '../primitives/utils/split-props';
import { Collapsible as PrimitiveCollapsible } from '../primitives/components/collapsible';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  CollapsibleAppearanceProvider,
  type CollapsibleAppearanceState,
} from './collapsible-appearance';
import type { UseCollapsibleReturn } from './collapsible-machine';
import {
  useCollapsibleRootProps,
  useCollapsibleRootProviderProps,
  type CollapsibleRootProps,
  type CollapsibleRootProviderProps,
} from './collapsible-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type RuntimeProviderProps = RuntimeRootProps & { value: UseCollapsibleReturn };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Bind native attributes and the unstyled scope to either primitive root mode. */
function renderCollapsibleRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveCollapsible.Root : PrimitiveCollapsible.RootProvider;
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const appearance: CollapsibleAppearanceState = {
    /** Keep descendant presentation in sync with the root. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Forward the caller's callback ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine and native attributes reactive. */
    () => native,
    {
      /** Preserve the consumer ref on the default root. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'collapsible__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation without changing the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Mount parts under the nearest primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve selected and caller-owned root elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <CollapsibleAppearanceProvider value={appearance}>
      {/* The primitive's two root signatures meet at this native adapter. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </CollapsibleAppearanceProvider>
  );
}

/** Render a Collapsible with its own primitive and Zag state machine. */
function CollapsibleRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderCollapsibleRoot({ mode: 'root', props: useCollapsibleRootProps(instance) }, content);
}

/** Expose a typed Collapsible root with native element selection. */
export const CollapsibleRoot = CollapsibleRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: CollapsibleRootProps<As>,
) => JSX.Element;

/** Render a Collapsible around a caller-owned primitive state machine. */
function CollapsibleRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderCollapsibleRoot(
    { mode: 'provider', props: useCollapsibleRootProviderProps(instance) },
    content,
  );
}

/** Require the caller's Collapsible machine accessor. */
export const CollapsibleRootProvider = CollapsibleRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: CollapsibleRootProviderProps<As>,
) => JSX.Element;
