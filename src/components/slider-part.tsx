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
import { useSliderAppearance } from './slider-appearance';
import { sliderPartComponents, sliderPartTags, type SliderPartSlot } from './slider-part-registry';
import type { SliderPartBehavior } from './slider-part-props';
import type { ClassValue } from '../utils/class-value';

export type SliderRuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?:
    | PolymorphicProps<'div'>['asChild']
    | PolymorphicProps<'span'>['asChild']
    | PolymorphicProps<'label'>['asChild'];
  children?: JSX.Element | undefined;
};
type SliderPartInput = {
  [Slot in SliderPartSlot]: {
    slot: Slot;
    props: SliderRuntimePartProps & SliderPartBehavior<Slot>;
  };
}[SliderPartSlot];

/** Forward one native Slider part while the primitive owns interaction and form behavior. */
export function renderSliderPart(input: SliderPartInput): JSX.Element {
  const { slot, props } = input;
  const appearance = useSliderAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? sliderPartTags[slot];
  }

  /** Forward the part ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive behavior and native attributes reactive. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve the caller's native element ref. */
      get ref() {
        return local.ref;
      },
      /** Compose a stable public hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`slider__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress default CSS without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve caller-rendered or selected native elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
      /** Keep items and nested content inside their primitive part. */
      get children() {
        return content.children;
      },
    },
  );

  // The registry binds every public slot to its matching primitive part.
  return createComponent(
    sliderPartComponents[slot] as Component<typeof primitiveProps>,
    primitiveProps,
  );
}
