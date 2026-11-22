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
import { toastPartComponents, toastPartTags, type ToastPartSlot } from './toast-part-registry';
import type { ClassValue } from '../utils/class-value';

export type ToastPartRenderProps = NativeHtmlAliases & {
  unstyled?: boolean;
  class?: ClassValue;
  className?: string;
  ref?: unknown;
  as?: PrimitiveNativeTag;
  asChild?: PolymorphicProps<PrimitiveNativeTag>['asChild'] | undefined;
  children?: JSX.Element;
};

/** Attach a stable CSS hook to one primitive-owned Toast part. */
export function renderToastPart(slot: ToastPartSlot, props: ToastPartRenderProps): JSX.Element {
  const part = toastPartComponents[slot];
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native tag for this Toast part. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? toastPartTags[slot];
  }

  /** Forward the caller's current ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward the primitive behavior and current native attributes. */
    () => native,
    /** Translate native HTML aliases on the rendered part. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve refs on default and caller-owned elements. */
      get ref() {
        return local.ref;
      },
      /** Expose one stable class per public Toast part. */
      get class() {
        return composeRecipeClassNames(`toast__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress only this part's default CSS rules. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Preserve caller content in the primitive's accessible part. */
      get children() {
        return content.children;
      },
      /** Render a selected tag or caller-owned child when provided. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
