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
import { listboxAppearanceAttributes, useListboxAppearance } from './listbox-appearance';
import {
  listboxPartComponents,
  listboxPartTags,
  type ListboxPartSlot,
} from './listbox-part-registry';
import type { ClassValue } from '../utils/class-value';
type RuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};

/** Forward one native Listbox part while the primitive retains machine behavior. */
export function renderListboxPart(
  slot: ListboxPartSlot,
  props: unknown,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  // The public part signature checks each slot before this mixed primitive boundary.
  const runtimeProps = props as RuntimePartProps;
  const part = listboxPartComponents[slot] as Component<object>;
  const appearance = useListboxAppearance();
  const [content, local, native] = splitProps(
    runtimeProps,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? listboxPartTags[slot];
  }

  /** Expose the caller ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward machine and native props without CSS extraction. */
    () => native,
    /** Convert Lever UI native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    /** Keep finite selectors on every native part. */
    () => listboxAppearanceAttributes(appearance),
    {
      /** Preserve the caller ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with caller classes. */
      get class() {
        return composeRecipeClassNames(`listbox__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress authored presentation for a root or one part. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve a caller-rendered child or selected native element. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        // The primitive layer renders ItemText as a `div`; keep Lever's inline `span`.
        return local.as || slot === 'itemText' ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    defaultChildren
      ? {
          /** Supply the default icon when no caller child exists. */
          get children() {
            return defaultChildren();
          },
        }
      : {},
    /** Retain the original JSX getter for stable server and client keys. */
    content,
  );

  // The slot registry selects the matching primitive part and native tag.
  return createComponent(part, primitiveProps);
}
