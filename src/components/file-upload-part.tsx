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
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import type { FileUploadPartRenderer } from './file-upload-part-contract';
import {
  fileUploadPartComponents,
  fileUploadPartTags,
  type FileUploadPartSlot,
} from './file-upload-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: FileUploadIntrinsicElement | undefined;
  asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
  children?: JSX.Element | undefined;
};

/**
 * Bind one File Upload part to the primitive behavior and stable authored CSS hooks. Parts
 * that forward already-checked public props, such as `FileUploadItems`, call it directly.
 */
export function renderFileUploadPartImpl(
  slot: FileUploadPartSlot,
  props: unknown,
  defaultChildren?: JSX.Element,
): JSX.Element {
  // The public signatures prove the slot/props pair before this mixed primitive boundary.
  const runtimeProps = props as RuntimePartProps;
  const part = fileUploadPartComponents[slot] as Component<object>;
  const [content, local, native] = splitProps(
    runtimeProps,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller-selected native part tag. */
  function readTag(): FileUploadIntrinsicElement {
    return local.as ?? fileUploadPartTags[slot];
  }

  /** Forward the current part ref through child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve the primitive behavior and native attributes without style extraction. */
    () => native,
    /** Convert public native aliases at the rendered part. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve refs on default and selected native elements. */
      get ref() {
        return local.ref;
      },
      /** Expose the stable part hook and caller classes. */
      get class() {
        return composeRecipeClassNames(
          `file-upload__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress this part's default presentation without changing the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Supply default glyphs unless the caller provides content. */
      get children() {
        return content.children === undefined ? defaultChildren : content.children;
      },
      /** Preserve caller-owned or selected native elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part, primitiveProps);
}

/** Expose checked slot-to-prop signatures for every File Upload part. */
export const renderFileUploadPart = renderFileUploadPartImpl as FileUploadPartRenderer;
