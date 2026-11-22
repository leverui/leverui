import { splitProps } from '../primitives/utils/split-props';
import { Splitter as PrimitiveSplitter } from '../primitives/components/splitter';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { SplitterAppearanceProvider, type SplitterAppearanceState } from './splitter-appearance';
import type { SplitterRuntimeProviderProps, SplitterRuntimeRootProps } from './splitter-props';

type RootInput =
  | { mode: 'root'; props: SplitterRuntimeRootProps }
  | { mode: 'provider'; props: SplitterRuntimeProviderProps };

/** Attach stable CSS hooks around either primitive Splitter root mode. */
export function renderSplitterRoot(input: RootInput): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveSplitter.Root : PrimitiveSplitter.RootProvider;
  const [content, local, native] = splitProps(
    input.props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );
  const appearance: SplitterAppearanceState = {
    /** Follow the root's changing presentation choice. */
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
    {
      /** Forward the caller ref to the selected native element. */
      get ref() {
        return local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('splitter__root', undefined, local.class, local.className);
      },
      /** Suppress authored presentation without changing the primitive behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Place panels beneath the primitive's machine context. */
      get children() {
        return content.children;
      },
      /** Preserve a selected native tag or caller-rendered child. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <SplitterAppearanceProvider value={appearance}>
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </SplitterAppearanceProvider>
  );
}
