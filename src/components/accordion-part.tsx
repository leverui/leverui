import { splitProps } from '../primitives/utils/split-props';
import type { AccordionItemProps as PrimitiveAccordionItemProps } from '../primitives/components/accordion';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useAccordionAppearance } from './accordion-appearance';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  accordionPartComponents,
  accordionPartTags,
  type AccordionPartSlot,
} from './accordion-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: unknown | undefined;
  children?: JSX.Element | undefined;
};
type AccordionPartInput = {
  [Slot in AccordionPartSlot]: {
    slot: Slot;
    props: RuntimePartProps &
      (Slot extends 'item' ? Pick<PrimitiveAccordionItemProps, 'value'> : object);
  };
}[AccordionPartSlot];

/** Forward native part props while the primitive owns disclosure and focus state. */
export function renderAccordionPart(input: AccordionPartInput): JSX.Element {
  const { slot, props } = input;
  const part = accordionPartComponents[slot];
  const appearance = useAccordionAppearance();
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);

  /** Follow a selected native element for this part. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? accordionPartTags[slot];
  }

  /** Forward the caller's callback ref through the primitive. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine and native attributes reactive. */
    () => native,
    {
      /** Preserve the part ref on the default native element. */
      get ref() {
        return local.ref;
      },
      /** Compose the public part hook with caller classes. */
      get class() {
        return composeRecipeClassNames(
          `accordion__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation under an unstyled root or part. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Construct nested parts beneath the current primitive item context. */
      get children() {
        return local.children;
      },
      /** Preserve caller-owned and selected native part elements. */
      get asChild() {
        if (typeof local.asChild === 'function') {
          // The primitive's mixed slot signatures erase the child callback at this boundary.
          return primitiveChildWithRef(
            local.asChild as Parameters<typeof primitiveChildWithRef>[0],
            readRef,
          );
        }
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The primitive declares each part separately; the discriminated slot binds its props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
