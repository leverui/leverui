import { splitProps } from '../primitives/utils/split-props';
import { ScrollArea as PrimitiveScrollArea } from '../primitives/components/scroll-area';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  ScrollAreaAppearanceProvider,
  type ScrollAreaAppearanceState,
} from './scroll-area-appearance';
import { scrollAreaAttributes } from './scroll-area-attributes';
import {
  useScrollAreaRootProps,
  useScrollAreaRootProviderProps,
  type ScrollAreaRootProps,
  type ScrollAreaRootProviderProps,
  type ScrollAreaRuntimeProviderProps,
  type ScrollAreaRuntimeRootProps,
} from './scroll-area-props';

type RootInput =
  | { mode: 'root'; props: ScrollAreaRuntimeRootProps }
  | { mode: 'provider'; props: ScrollAreaRuntimeProviderProps };

/** Bind authored CSS hooks around either primitive Scroll Area root mode. */
function renderScrollAreaRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveScrollArea.Root : PrimitiveScrollArea.RootProvider;
  const [local, native] = splitProps(input.props, [
    'size',
    'variant',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const appearance: ScrollAreaAppearanceState = {
    /** Follow the root's changing unstyled selection. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine options and native attributes reactively. */
    () => native,
    /** Convert html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Expose finite CSS choices without inserted styles. */
    () => scrollAreaAttributes(local),
    {
      /** Forward the caller ref to the selected native element. */
      get ref() {
        return local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'scroll-area__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Resolve children beneath the primitive's scroll context. */
      get children() {
        return content.children;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <ScrollAreaAppearanceProvider value={appearance}>
      {/* The primitive's root modes share this native forwarding contract. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </ScrollAreaAppearanceProvider>
  );
}

/** Render a Scroll Area with its own primitive and Zag machine. */
function ScrollAreaRootImpl(props: ScrollAreaRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderScrollAreaRoot({ mode: 'root', props: useScrollAreaRootProps(instance) }, content);
}

/** Expose native, selected-tag, and caller-owned Scroll Area roots. */
export const ScrollAreaRoot = ScrollAreaRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ScrollAreaRootProps<As>,
) => JSX.Element;

/** Render a Scroll Area around a caller-owned primitive machine. */
function ScrollAreaRootProviderImpl(props: ScrollAreaRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderScrollAreaRoot(
    { mode: 'provider', props: useScrollAreaRootProviderProps(instance) },
    content,
  );
}

/** Require an external scroll machine on provider roots. */
export const ScrollAreaRootProvider = ScrollAreaRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: ScrollAreaRootProviderProps<As>,
) => JSX.Element;
