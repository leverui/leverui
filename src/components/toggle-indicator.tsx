import { splitProps } from '../primitives/utils/split-props';
import { Toggle as PrimitiveToggle } from '../primitives/components/toggle';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { ToggleIndicatorProps } from './toggle-props';
import type { ToggleRuntimeIndicatorProps } from './toggle-runtime-props';

/** Preserve the primitive's conditional indicator with a stable CSS part hook. */
function ToggleIndicatorImpl(props: ToggleRuntimeIndicatorProps): JSX.Element {
  const [content, local, rest] = splitProps(
    props,
    ['children', 'fallback'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native indicator tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'span';
  }

  /** Expose the caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Retain the primitive attributes without style extraction. */
    () => rest,
    /** Translate native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve callback refs on the default span. */
      get ref() {
        return local.ref;
      },
      /** Combine the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'toggle__indicator',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Expose the unstyled choice to authored CSS. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /**
       * Preserve a caller-owned child or the selected native element. The primitive
       * 6.0.0-next.0 renders this indicator as a `div`, so Lever always selects
       * its documented `span` default.
       */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return primitiveAsChild<'span'>(readTag, readRef);
      },
    },
    content,
  );

  return createComponent(
    PrimitiveToggle.Indicator as Component<typeof primitiveProps>,
    primitiveProps,
  );
}

/** Expose typed native, selected-tag, and child Toggle indicators. */
export const ToggleIndicator = ToggleIndicatorImpl as <As extends PrimitiveNativeTag = 'span'>(
  props: ToggleIndicatorProps<As>,
) => JSX.Element;
