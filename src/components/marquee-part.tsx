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
import { useMarqueeAppearance } from './marquee-appearance';
import type { MarqueeSide } from './marquee-machine';
import {
  marqueePartComponents,
  marqueePartTags,
  type MarqueePartSlot,
} from './marquee-part-registry';
import type { ClassValue } from '../utils/class-value';

export type MarqueeRuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  side?: MarqueeSide | undefined;
  children?: JSX.Element | undefined;
};

/** Forward one native Marquee part while the primitive owns motion and repetition. */
export function renderMarqueePart(
  slot: MarqueePartSlot,
  props: MarqueeRuntimePartProps,
): JSX.Element {
  const appearance = useMarqueeAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? marqueePartTags[slot];
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
      /** Compose the public part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`marquee__${slot}`, undefined, local.class, local.className);
      },
      /** Forward the native element to its consumer. */
      get ref() {
        return local.ref;
      },
      /** Suppress default CSS without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve a selected native tag or caller-rendered child. */
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
    marqueePartComponents[slot] as Component<typeof primitiveProps>,
    primitiveProps,
  );
}
