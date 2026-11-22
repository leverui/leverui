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
import { popoverSizeAttributes, usePopoverAppearance } from './popover-appearance';
import {
  popoverPartComponents,
  popoverPartTags,
  type PopoverPartSlot,
} from './popover-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<Tag extends PrimitiveNativeTag> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};

/** Forward one native Popover part while the primitive owns behavior and focus rules. */
export function renderPopoverPart<Slot extends PopoverPartSlot>(
  slot: Slot,
  props: RuntimePartProps<(typeof popoverPartTags)[Slot]>,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const appearance = usePopoverAppearance();
  let defaultChild: JSX.Element;
  let defaultChildCreated = false;
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Resolve a caller-selected tag or this part's native default. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? popoverPartTags[slot];
  }

  /** Deliver the native node through a caller-owned callback ref. */
  function readRef(): unknown {
    return local.ref;
  }

  /** Reflect finite size choices only on the visual content part. */
  function sizeAttributes(): ReturnType<typeof popoverSizeAttributes> | object {
    return slot === 'content' ? popoverSizeAttributes(appearance.size()) : {};
  }

  const primitiveProps = mergeProps(
    /** Keep native attributes and the primitive behavior reactive. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Bind responsive size selectors without a stylesheet runtime. */
    sizeAttributes,
    {
      /** Forward the native part ref through the primitive. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`popover__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress only default presentation while retaining the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Create a default arrow tip only when children are absent. */
      get children() {
        const children = content.children;
        if (children !== undefined || !defaultChildren) return children;
        if (!defaultChildCreated) {
          defaultChild = defaultChildren();
          defaultChildCreated = true;
        }
        return defaultChild;
      },
      /** Preserve caller-owned children and selected native tags. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        // The primitive layer renders Title as a `div`; keep Lever's `h2` heading.
        if (local.as || slot === 'title') return primitiveAsChild(readTag, readRef);
        return undefined;
      },
    },
  );
  // The registry selects the matching primitive part at this polymorphic boundary.
  return createComponent(
    popoverPartComponents[slot] as Component<typeof primitiveProps>,
    primitiveProps,
  );
}
