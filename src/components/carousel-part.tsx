import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useCarouselAppearance } from './carousel-appearance';
import {
  carouselPartComponents,
  carouselPartTags,
  type CarouselPartSlot,
} from './carousel-part-registry';
import type { ClassValue } from '../utils/class-value';

export type CarouselRuntimePartProps<Tag extends PrimitiveNativeTag> = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};

/** Forward a native Carousel part while the primitive owns slide state and attributes. */
export function renderCarouselPart<Slot extends CarouselPartSlot>(
  slot: Slot,
  props: CarouselRuntimePartProps<(typeof carouselPartTags)[Slot]>,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const part = carouselPartComponents[slot];
  const appearance = useCarouselAppearance();
  let defaultChild: JSX.Element;
  let defaultChildCreated = false;
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);

  /** Follow a caller-selected native tag for this part. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? carouselPartTags[slot];
  }

  /** Forward the part's native element through the primitive. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive behavior and native attributes reactive. */
    () => native,
    {
      /** Forward the caller ref on the default element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `carousel__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Inherit the root's unstyled choice without hiding the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Render default icons only when caller content is absent. */
      get children() {
        const children = local.children;
        if (children !== undefined || !defaultChildren) return children;
        if (!defaultChildCreated) {
          defaultChild = defaultChildren();
          defaultChildCreated = true;
        }
        return defaultChild;
      },
      /** Preserve caller-owned or selected native elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The registry binds each part to its matching primitive component.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
