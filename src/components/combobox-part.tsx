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
import { comboboxAppearanceAttributes, useComboboxAppearance } from './combobox-appearance';
import type { CollectionItem } from './combobox-machine';
import {
  comboboxPartComponents,
  comboboxPartTags,
  type ComboboxPartSlot,
} from './combobox-part-registry';
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

type ComboboxPartInput<Slot extends ComboboxPartSlot> = RuntimePartProps<
  (typeof comboboxPartTags)[Slot]
> &
  (Slot extends 'item'
    ? { item: CollectionItem; persistFocus?: boolean | undefined }
    : { item?: never }) &
  (Slot extends 'trigger' ? { focusable?: boolean | undefined } : object);

/** Forward one native Combobox part while the primitive owns focus and presence. */
export function renderComboboxPart<Slot extends ComboboxPartSlot>(
  slot: Slot,
  props: ComboboxPartInput<NoInfer<Slot>>,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const appearance = useComboboxAppearance();
  const part = comboboxPartComponents[slot] as Component<object>;
  let defaultChild: JSX.Element;
  let defaultChildCreated = false;
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the native tag selected by the caller. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? comboboxPartTags[slot];
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
    () => comboboxAppearanceAttributes(appearance),
    {
      /** Preserve the caller ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `combobox__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation for this part or root. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Name the Lever-owned indicator group the way the primitive names its own parts. */
      get 'data-combobox-indicator-group'() {
        return slot === 'indicatorGroup' ? '' : undefined;
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
