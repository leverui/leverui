import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useCollapsibleAppearance } from './collapsible-appearance';
import {
  collapsiblePartComponents,
  collapsiblePartTags,
  type CollapsiblePartSlot,
} from './collapsible-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<Tag extends PrimitiveNativeTag> = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type CollapsiblePartInput = {
  [Slot in CollapsiblePartSlot]: {
    slot: Slot;
    props: RuntimePartProps<(typeof collapsiblePartTags)[Slot]>;
  };
}[CollapsiblePartSlot];

/** Forward one native part while the primitive owns disclosure and presence behavior. */
export function renderCollapsiblePart(input: CollapsiblePartInput): JSX.Element {
  const { slot, props } = input;
  const part = collapsiblePartComponents[slot];
  const appearance = useCollapsibleAppearance();
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);

  /** Follow the selected native element for this part. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? collapsiblePartTags[slot];
  }

  /** Forward the consumer ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep native and machine attributes reactive. */
    () => native,
    {
      /** Preserve the part ref on its native element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `collapsible__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Inherit the root's unstyled choice without hiding the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Mount caller content under the nearest primitive context. */
      get children() {
        return local.children;
      },
      /** Preserve caller-owned or selected part elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The primitive types each slot separately; the discriminated input binds its props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
