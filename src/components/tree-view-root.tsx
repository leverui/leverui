import { splitProps } from '../primitives/utils/split-props';
import { TreeView as PrimitiveTreeView } from '../primitives/components/tree-view';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { TreeViewAppearance } from './tree-view-appearance';
import { treeViewAttributes } from './tree-view-attributes';
import type { TreeNode, UseTreeViewReturn } from './tree-view-machine';
import type { TreeViewRootProps, TreeViewRootProviderProps } from './tree-view-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = NativeHtmlAliases &
  TreeViewAppearance & {
    class?: ClassValue | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeProviderProps = RuntimeRootProps & { value: UseTreeViewReturn<TreeNode> };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Keep the primitive's tree machine while reflecting finite CSS choices on its root. */
function renderTreeViewRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveTreeView.Root : PrimitiveTreeView.RootProvider;
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'animateContent',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);

  /** Read the caller's selected native root tag when present. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller's current root reference to the primitive. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine, render strategy, and native attributes. */
    () => native,
    /** Translate native HTML aliases before rendering the root. */
    () => nativeHtmlAttributes(local),
    /** Select authored size, variant, palette, and motion rules. */
    () => treeViewAttributes(props),
    {
      /** Keep refs on the primitive's native root. */
      get ref() {
        return local.ref;
      },
      /** Expose a stable hook alongside caller-owned classes. */
      get class() {
        return composeRecipeClassNames('tree-view__root', undefined, local.class, local.className);
      },
      /** Suppress default presentation without changing the tree machine. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep caller content beneath the primitive's machine context. */
      get children() {
        return content.children;
      },
      /** Forward a caller-owned or selected native root. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Create a primitive Tree View machine and render its CSS-owned root. */
function TreeViewRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderTreeViewRoot({ mode: 'root', props: instance }, content);
}

/** Expose a collection-typed root with native HTML props. */
export const TreeViewRoot = TreeViewRootImpl as <
  T extends TreeNode = TreeNode,
  As extends PrimitiveNativeTag = 'div',
>(
  props: TreeViewRootProps<T, As>,
) => JSX.Element;

/** Render around a caller-owned primitive tree accessor. */
function TreeViewRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderTreeViewRoot({ mode: 'provider', props: instance }, content);
}

/** Expose a collection-typed provider without replacing its machine. */
export const TreeViewRootProvider = TreeViewRootProviderImpl as <
  T extends TreeNode = TreeNode,
  As extends PrimitiveNativeTag = 'div',
>(
  props: TreeViewRootProviderProps<T, As>,
) => JSX.Element;
