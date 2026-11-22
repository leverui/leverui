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
import {
  floatingPanelPartComponents,
  floatingPanelPartTags,
  type FloatingPanelPartSlot,
} from './floating-panel-part-registry';
import { useFloatingPanelUnstyled } from './floating-panel-styles';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: unknown | undefined;
  children?: JSX.Element | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  placement?: string | undefined;
  stage?: string | undefined;
};
type FloatingPanelPartInput = { slot: FloatingPanelPartSlot; props: RuntimePartProps };

/** Render one native primitive part with stable, portal-safe authored CSS hooks. */
export function renderFloatingPanelPart(input: FloatingPanelPartInput): JSX.Element {
  const { slot, props } = input;
  const part = floatingPanelPartComponents[slot];
  const rootUnstyled = useFloatingPanelUnstyled();
  const [local, rest] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'children',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow a caller-selected native tag without freezing its props. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? floatingPanelPartTags[slot];
  }

  /** Deliver the primitive's native node to the caller-owned ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native attributes and style directly to the primitive. */
    () => rest,
    /** Preserve native HTML aliases on the actual part. */
    () => nativeHtmlAttributes(local),
    {
      /** Enable authored defaults only for styled parts. */
      get 'data-leverui-floating-panel-css'() {
        return rootUnstyled() || local.unstyled ? undefined : '';
      },
      /** Mark opted-out parts for consumer selectors. */
      get 'data-unstyled'() {
        return rootUnstyled() || local.unstyled ? '' : undefined;
      },
      /** Forward the native part ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook and caller classes. */
      get class() {
        return composeRecipeClassNames(
          `floating-panel__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Keep children under the primitive's nearest machine context. */
      get children() {
        return local.children;
      },
      /** Preserve caller-selected elements and child renderers. */
      get asChild() {
        if (local.asChild) {
          // The primitive's slot callback types share the same native rendering shape.
          return primitiveChildWithRef(
            local.asChild as NonNullable<PolymorphicProps<'div'>['asChild']>,
            readRef,
          );
        }
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );
  // The slot discriminant binds this primitive part to its native runtime props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
