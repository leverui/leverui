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
import {
  colorPickerAppearanceAttributes,
  useColorPickerAppearance,
} from './color-picker-appearance';
import type { ColorPickerPartBehavior } from './color-picker-part-props';
import {
  colorPickerPartComponents,
  colorPickerPartTags,
  type ColorPickerPartSlot,
} from './color-picker-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<Tag extends PrimitiveNativeTag> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  size?: string | number | false | undefined;
  children?: JSX.Element | undefined;
};
type ColorPickerPartInput = {
  [Slot in ColorPickerPartSlot]: {
    slot: Slot;
    props: RuntimePartProps<(typeof colorPickerPartTags)[Slot]> & ColorPickerPartBehavior<Slot>;
  };
}[ColorPickerPartSlot];

/** Forward one native part to the primitive while authored CSS handles presentation. */
export function renderColorPickerPart(input: ColorPickerPartInput): JSX.Element {
  const { slot, props } = input;
  const part = colorPickerPartComponents[slot];
  const appearance = useColorPickerAppearance();
  const [content, local, rest] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the selected native tag without freezing reactive props. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? colorPickerPartTags[slot];
  }

  /** Forward the caller's ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Retain native and machine props, including native style. */
    () => rest,
    /** Translate native HTML aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    /** Carry finite appearance choices through portals. */
    () => colorPickerAppearanceAttributes(appearance),
    {
      /** Keep authored defaults off parts opted out by root or caller. */
      get 'data-leverui-color-picker-css'() {
        return appearance.unstyled() || local.unstyled ? undefined : '';
      },
      /** Expose the unstyled choice to consumer CSS. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve the native ref on every part. */
      get ref() {
        return local.ref;
      },
      /** Preserve the public hook and shared swatch style hook. */
      get class() {
        return composeRecipeClassNames(
          `color-picker__${slot}`,
          slot === 'channelInput'
            ? recipeClassName('input')
            : slot === 'swatch' || slot === 'valueSwatch'
              ? `${recipeClassName('color-picker__swatch')} ${recipeClassName('color-swatch')}`
              : undefined,
          local.class,
          local.className,
        );
      },
      /** Preserve selected elements and caller-owned child renderers. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    content,
  );
  // The discriminated input binds each primitive part to its matching props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
