import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { usePaginationUnstyled } from './pagination-appearance';
import { usePaginationContext } from './pagination-machine';
import {
  paginationPartComponents,
  paginationPartTags,
  type PaginationPartSlot,
} from './pagination-part-registry';
import type { ClassValue } from '../utils/class-value';

export type PaginationRuntimePartProps<Tag extends PrimitiveNativeTag> = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  index?: number | undefined;
  value?: string | number | false | undefined;
  type?: string | false | undefined;
  children?: JSX.Element | undefined;
};

/** Forward one native Pagination part while the primitive owns navigation behavior. */
export function renderPaginationPart<Slot extends PaginationPartSlot>(
  slot: Slot,
  props: PaginationRuntimePartProps<(typeof paginationPartTags)[Slot]>,
): JSX.Element {
  const part = paginationPartComponents[slot];
  const pagination = usePaginationContext();
  const rootUnstyled = usePaginationUnstyled();
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'children',
  ]);

  /**
   * Whether the machine is in link mode. Zag 2 no longer exposes `type`; in
   * link mode it gives every trigger an `href` from `getPageUrl`.
   */
  function isLinkMode(): boolean {
    return 'href' in pagination().getFirstTriggerProps();
  }

  /** Select an anchor when the primitive's current machine uses link mode. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? (slot !== 'ellipsis' && isLinkMode() ? 'a' : paginationPartTags[slot]);
  }

  /** Give the selected child the consumer's current ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep behavior and native attributes reactive. */
    () => native,
    {
      /** Preserve refs on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Expose a stable hook for this public part. */
      get class() {
        return composeRecipeClassNames(
          `pagination__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation for an unstyled root or part. */
      get 'data-unstyled'() {
        return local.unstyled || rootUnstyled() ? '' : undefined;
      },
      /** Keep caller content under the primitive's machine attributes. */
      get children() {
        return local.children;
      },
      /** Preserve caller-owned elements and link-mode anchors. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as || (slot !== 'ellipsis' && isLinkMode())
          ? primitiveAsChild(readTag, readRef)
          : undefined;
      },
    },
  );

  // The primitive's mixed part signatures need one cast at the registry boundary.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
