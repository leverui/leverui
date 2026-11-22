import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import type { RatingGroupItemProps as PrimitiveItemProps } from '../primitives/components/rating-group';
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
import { useRatingGroupAppearance } from './rating-group-appearance';
import {
  ratingGroupPartComponents,
  ratingGroupPartTags,
  type RatingGroupPartSlot,
} from './rating-group-part-registry';
import type { ClassValue } from '../utils/class-value';

export type RatingGroupRuntimePartProps<Tag extends PrimitiveNativeTag> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type RatingGroupPartInput = {
  [Slot in RatingGroupPartSlot]: {
    slot: Slot;
    props: RatingGroupRuntimePartProps<(typeof ratingGroupPartTags)[Slot]> &
      (Slot extends 'item' ? Pick<PrimitiveItemProps, 'index'> : object);
  };
}[RatingGroupPartSlot];

/** Render one native Rating Group part while the primitive owns selection and focus. */
export function renderRatingGroupPart(input: RatingGroupPartInput): JSX.Element {
  const { slot, props } = input;
  const part = ratingGroupPartComponents[slot];
  const appearance = useRatingGroupAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller's selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? ratingGroupPartTags[slot];
  }

  /** Forward the caller's ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve the primitive behavior and changing native attributes. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Forward the ref to the default or selected native element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable public part class with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `rating-group__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Select a native tag or caller-owned child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    content,
  );

  // The primitive declares each slot separately; this registry binds the slot to its props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
