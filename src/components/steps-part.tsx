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
import { stepsPartComponents, stepsPartTags, type StepsPartSlot } from './steps-part-registry';
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

/** Bind a public Steps part to the primitive behavior and stable CSS hooks. */
export function renderStepsPart<Slot extends StepsPartSlot>(
  slot: Slot,
  props: RuntimePartProps<(typeof stepsPartTags)[Slot]>,
): JSX.Element {
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? stepsPartTags[slot];
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
      /** Expose the exact public part hook and consumer classes. */
      get class() {
        return composeRecipeClassNames(`steps__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress this part's authored presentation only. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Render caller content inside the machine-owned part. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned or selected native elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The registry pairs each public slot with its corresponding primitive part.
  const part = stepsPartComponents[slot] as Component<typeof primitiveProps>;
  return createComponent(part, primitiveProps);
}
