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
import { useScrollAreaAppearance } from './scroll-area-appearance';
import {
  scrollAreaPartComponents,
  scrollAreaPartTags,
  type ScrollAreaPartSlot,
} from './scroll-area-part-registry';
import type { ClassValue } from '../utils/class-value';

export type ScrollAreaRuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  children?: JSX.Element | undefined;
};

/** Forward one native Scroll Area part while the primitive owns scroll behavior. */
export function renderScrollAreaPart(input: {
  slot: ScrollAreaPartSlot;
  props: ScrollAreaRuntimePartProps;
}): JSX.Element {
  const { slot, props } = input;
  const part = scrollAreaPartComponents[slot];
  const appearance = useScrollAreaAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? scrollAreaPartTags[slot];
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive behavior and changing native attributes reactive. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Forward the ref to the default or selected native element. */
      get ref() {
        return local.ref;
      },
      /** Compose the public part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `scroll-area__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
    content,
  );

  // The primitive declares each slot separately; the registry binds the slot to its props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
