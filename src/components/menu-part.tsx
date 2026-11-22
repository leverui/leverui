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
import { composeRecipeClassNames, recipeClassName } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { menuAppearanceAttributes, useMenuAppearance } from './menu-appearance';
import {
  menuPartComponents,
  menuPartTags,
  menuStyleSlots,
  type MenuPartSlot,
} from './menu-part-registry';
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

/** Render one native menu part while the primitive owns behavior and nested contexts. */
export function renderMenuPart<Slot extends MenuPartSlot>(
  slot: Slot,
  props: RuntimePartProps<(typeof menuPartTags)[Slot]>,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const part = menuPartComponents[slot];
  const styleSlot = menuStyleSlots[slot];
  const appearance = useMenuAppearance();
  let defaultChild: JSX.Element;
  let defaultChildCreated = false;
  const [content, local, rest] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Resolve a caller-selected tag or this part's native default. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? menuPartTags[slot];
  }

  /** Deliver the native node through a caller-owned callback ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native attributes and machine props directly to the primitive. */
    () => rest,
    /** Preserve native HTML aliases on the rendered element. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite choices on each part across portals and nested menus. */
    () => menuAppearanceAttributes(appearance),
    {
      /** Keep authored defaults off parts opted out by the root or caller. */
      get 'data-leverui-menu-css'() {
        return appearance.unstyled() || local.unstyled ? undefined : '';
      },
      /** Expose the unstyled choice to consumer CSS. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Forward the native part ref through the primitive. */
      get ref() {
        return local.ref;
      },
      /** Compose the public part hook, shared style hook, and caller classes. */
      get class() {
        return composeRecipeClassNames(
          `menu__${slot}`,
          String(styleSlot) === slot ? undefined : recipeClassName(`menu__${styleSlot}`),
          local.class,
          local.className,
        );
      },
      /** Create a default arrow or selection mark only when children are absent. */
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
        if (local.as) return primitiveAsChild(readTag, readRef);
        return undefined;
      },
    },
  );
  // The slot selects the matching primitive part at this polymorphic interop boundary.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
