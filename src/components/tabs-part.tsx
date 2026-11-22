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
import { useTabsContext } from './tabs-machine';
import { tabsPartComponents, tabsPartTags, type TabsPartSlot } from './tabs-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<
  Tag extends PrimitiveNativeTag,
  Slot extends TabsPartSlot,
> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
} & (Slot extends 'trigger' | 'content' ? { value: string } : { value?: string });

/** Preserve the public missing-root guidance for every Tabs part. */
function requireTabsContext(): void {
  try {
    useTabsContext();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('useTabsContext returned')) {
      throw new Error('Tabs parts must be inside TabsRoot or TabsRootProvider.', { cause: error });
    }
    throw error;
  }
}

/** Render one native Tabs part while the primitive owns selection and accessible state. */
export function renderTabsPart<Slot extends TabsPartSlot>(
  slot: Slot,
  props: RuntimePartProps<(typeof tabsPartTags)[Slot], Slot>,
): JSX.Element {
  requireTabsContext();
  const [content, local, rest] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Read a caller-selected native tag without freezing it. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? tabsPartTags[slot];
  }

  /** Forward the part's native element to the caller. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve native and primitive behavior props, including native style. */
    () => rest,
    /** Translate native aliases at the rendered part. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve refs on default and caller-owned elements. */
      get ref() {
        return local.ref;
      },
      /** Keep the stable public part class and caller classes. */
      get class() {
        return composeRecipeClassNames(`tabs__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress authored presentation for an unstyled part. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Render supplied content inside the machine-owned part. */
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

  // The registry pairs each slot with its primitive part; RuntimePartProps preserves
  // the trigger and content values required before this dynamic dispatch.
  return createComponent(
    tabsPartComponents[slot] as Component<typeof primitiveProps>,
    primitiveProps,
  );
}
