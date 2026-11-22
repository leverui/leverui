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
  tagsInputPartComponents,
  tagsInputPartTags,
  type TagsInputPartSlot,
} from './tags-input-part-registry';
import type { ClassValue } from '../utils/class-value';

export type TagsInputPartRenderProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<PrimitiveNativeTag>['asChild'] | undefined;
  index?: number | undefined;
  value?: string | number | string[] | false | undefined;
  disabled?: boolean | '' | undefined;
  children?: JSX.Element | undefined;
};

/** Bind one primitive-owned Tags Input part to a stable authored CSS hook. */
export function renderTagsInputPart(
  slot: TagsInputPartSlot,
  props: TagsInputPartRenderProps,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const part = tagsInputPartComponents[slot];
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'children',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow the caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? tagsInputPartTags[slot];
  }

  /** Forward the current part ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve current primitive behavior and native attributes. */
    () => native,
    /** Translate supported native aliases at the rendered part. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve refs on native and caller-owned parts. */
      get ref() {
        return local.ref;
      },
      /** Expose a stable part hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `tags-input__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress default presentation while retaining the primitive semantics. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Use a default icon only when no children were supplied. */
      get children() {
        const children = local.children;
        return children === undefined ? defaultChildren?.() : children;
      },
      /** Preserve caller-owned or selected native parts. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
