import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import type { SegmentGroupItemProps as PrimitiveItemProps } from '../primitives/components/segment-group';
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
import { useSegmentGroupAppearance } from './segment-group-appearance';
import {
  segmentGroupPartComponents,
  segmentGroupPartTags,
  type SegmentGroupPartSlot,
} from './segment-group-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<Tag extends PrimitiveNativeTag> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type SegmentGroupPartInput = {
  [Slot in SegmentGroupPartSlot]: {
    slot: Slot;
    props: RuntimePartProps<(typeof segmentGroupPartTags)[Slot]> &
      (Slot extends 'item' ? Pick<PrimitiveItemProps, 'value'> : object);
  };
}[SegmentGroupPartSlot];

/** Forward one native Segment Group part while the primitive owns radio behavior. */
export function renderSegmentGroupPart(input: SegmentGroupPartInput): JSX.Element {
  const { slot, props } = input;
  const part = segmentGroupPartComponents[slot];
  const appearance = useSegmentGroupAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? segmentGroupPartTags[slot];
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
          `segment-group__${slot}`,
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
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    content,
  );

  // The primitive declares each slot separately; the registry binds the slot to its props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
