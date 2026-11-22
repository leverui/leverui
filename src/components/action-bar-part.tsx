import { splitProps } from '../primitives/utils/split-props';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useActionBarAppearance } from './action-bar-appearance';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  actionBarPartComponents,
  actionBarPartTags,
  type ActionBarPartSlot,
} from './action-bar-part-registry';
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
type ActionBarPartInput = {
  [Slot in ActionBarPartSlot]: { slot: Slot; props: RuntimePartProps };
}[ActionBarPartSlot];

/** Forward native part props while the primitive owns content and close behavior. */
export function renderActionBarPart(input: ActionBarPartInput): JSX.Element {
  const { slot, props } = input;
  const part = actionBarPartComponents[slot];
  const appearance = useActionBarAppearance();
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);

  /** Follow the selected native element without freezing its tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? actionBarPartTags[slot];
  }

  /** Forward a caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const buttonDefaults = slot === 'selectionTrigger' ? { type: 'button' } : {};
  const primitiveProps = mergeProps(
    buttonDefaults,
    /** Forward native and primitive behavior props reactively. */
    () => native,
    /** Bind finite placement only to the public positioner. */
    () => (slot === 'positioner' ? appearance.placement() : {}),
    {
      /** Preserve the caller's part ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the public part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `action-bar__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress default presentation under an unstyled root or part. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Keep Action Bar children under their nearest primitive context. */
      get children() {
        return local.children;
      },
      /** Preserve native polymorphism and caller-owned child renderers. */
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
