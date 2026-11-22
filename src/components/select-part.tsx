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
import { selectAppearanceAttributes, useSelectAppearance } from './select-appearance';
import type { CollectionItem } from './select-machine';
import { selectPartComponents, selectPartTags, type SelectPartSlot } from './select-part-registry';
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

type SelectPartInput<Slot extends SelectPartSlot> = RuntimePartProps<
  (typeof selectPartTags)[Slot]
> &
  (Slot extends 'item'
    ? { item: CollectionItem; persistFocus?: boolean | undefined }
    : { item?: never }) &
  (Slot extends 'valueText' ? { placeholder?: string } : object);

/** Forward one native Select part while the primitive owns focus and presence. */
export function renderSelectPart<Slot extends SelectPartSlot>(
  slot: Slot,
  props: SelectPartInput<NoInfer<Slot>>,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const appearance = useSelectAppearance();
  const part = selectPartComponents[slot] as Component<object>;
  let defaultChild: JSX.Element;
  let defaultChildCreated = false;
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the native tag selected by the caller. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? selectPartTags[slot];
  }

  /** Forward the caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward machine and native attributes without style extraction. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Keep finite selectors on parts moved into a portal. */
    () => selectAppearanceAttributes(appearance),
    {
      /** Preserve the caller ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`select__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress authored presentation for this part or root. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve a caller-rendered child or selected native element. */
      get asChild() {
        const child = local.asChild;
        if (child) {
          // The primitive's mixed slot signatures erase the child callback tag at this boundary.
          return primitiveChildWithRef(
            child as NonNullable<PolymorphicProps<'div'>['asChild']>,
            readRef,
          );
        }
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    defaultChildren
      ? {
          /** Supply the default icon only when caller children are absent. */
          get children() {
            const children = content.children;
            if (children !== undefined) return children;
            if (!defaultChildCreated) {
              defaultChild = defaultChildren();
              defaultChildCreated = true;
            }
            return defaultChild;
          },
        }
      : {
          /** Retain the caller's JSX getter for hydration keys. */
          get children() {
            return content.children;
          },
        },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
