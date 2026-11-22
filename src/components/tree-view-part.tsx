import { splitProps } from '../primitives/utils/split-props';
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
import {
  treeViewPartComponents,
  treeViewPartTags,
  type TreeViewPartSlot,
} from './tree-view-part-registry';
import type { ClassValue } from '../utils/class-value';

export type TreeViewPartRenderProps = NativeHtmlAliases & {
  unstyled?: boolean;
  class?: ClassValue;
  className?: string;
  ref?: unknown;
  as?: PrimitiveNativeTag;
  asChild?: PolymorphicProps<PrimitiveNativeTag>['asChild'] | undefined;
  children?: JSX.Element;
};

/** Render one native primitive part with a stable Tree View CSS hook. */
export function renderTreeViewPart(
  slot: TreeViewPartSlot,
  props: TreeViewPartRenderProps,
): JSX.Element {
  const part = treeViewPartComponents[slot];
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? treeViewPartTags[slot];
  }

  /** Forward the caller's current part reference to the primitive. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward the primitive behavior and native attributes unchanged. */
    () => native,
    /** Translate native HTML aliases on the rendered part. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve refs on default and selected native elements. */
      get ref() {
        return local.ref;
      },
      /** Expose one stable class per public Tree View part. */
      get class() {
        return composeRecipeClassNames(
          `tree-view__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress only this part's default CSS rules. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Preserve caller content under the primitive's part context. */
      get children() {
        return content.children;
      },
      /** Render a caller-owned child or selected native part. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
