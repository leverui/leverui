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
import { useSwitchAppearance } from './switch-appearance';
import { switchPartComponents, switchPartTags, type SwitchPartSlot } from './switch-part-registry';
import type { ClassValue } from '../utils/class-value';

export type SwitchRuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'span'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type SwitchPartInput = {
  [Slot in SwitchPartSlot]: {
    slot: Slot;
    props: SwitchRuntimePartProps;
  };
}[SwitchPartSlot];

/** Forward one native Switch part while the primitive owns interaction and form behavior. */
export function renderSwitchPart(input: SwitchPartInput): JSX.Element {
  const { slot, props } = input;
  const appearance = useSwitchAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? switchPartTags[slot];
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
        return composeRecipeClassNames(`switch__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress default CSS without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve caller-rendered or selected native elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'span'>(readTag, readRef) : undefined;
      },
      /** Keep items and nested content inside their primitive part. */
      get children() {
        return content.children;
      },
    },
  );

  // The registry binds every public slot to its matching primitive part.
  return createComponent(
    switchPartComponents[slot] as Component<typeof primitiveProps>,
    primitiveProps,
  );
}
