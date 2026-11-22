import { splitProps } from '../primitives/utils/split-props';
import { ColorPicker as PrimitiveColorPicker } from '../primitives/components/color-picker';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  ColorPickerAppearanceProvider,
  colorPickerAppearanceAttributes,
  readColorPickerSize,
  readColorPickerVariant,
  type ColorPickerAppearanceState,
} from './color-picker-appearance';
import {
  useColorPickerRootProps,
  useColorPickerRootProviderProps,
  type ColorPickerRootProps,
  type ColorPickerRootProviderProps,
} from './color-picker-props';
import type {
  ColorPickerRuntimeProviderProps,
  ColorPickerRuntimeRootProps,
} from './color-picker-runtime-props';

type RootInput =
  | { mode: 'root'; props: ColorPickerRuntimeRootProps }
  | { mode: 'provider'; props: ColorPickerRuntimeProviderProps };

/** Scope native ColorPicker presentation around an owned or external primitive machine. */
function renderColorPickerRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, rest] = splitProps(input.props, [
    'size',
    'variant',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const size = createMemo(
    /** Revalidate only when this root's size changes. */
    () => readColorPickerSize(local.size),
  );
  const variant = createMemo(
    /** Revalidate only when this root's variant changes. */
    () => readColorPickerVariant(local.variant),
  );
  const appearance: ColorPickerAppearanceState = {
    size,
    variant,
    /** Follow inherited or explicit unstyled changes through portals. */
    unstyled: () => Boolean(local.unstyled),
  };
  const part =
    input.mode === 'root' ? PrimitiveColorPicker.Root : PrimitiveColorPicker.RootProvider;

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller's root ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine, presence, and native attributes reactive. */
    () => rest,
    /** Translate Lever UI native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite choices on the root's native element. */
    () => colorPickerAppearanceAttributes(appearance),
    {
      /** Gate authored defaults when the caller opts out. */
      get 'data-leverui-color-picker-css'() {
        return local.unstyled ? undefined : '';
      },
      /** Expose the caller's unstyled choice to custom CSS. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Preserve the caller's native root ref. */
      get ref() {
        return local.ref;
      },
      /** Keep the public root hook and consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'color-picker__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Keep compound parts beneath the primitive's machine context. */
      get children() {
        return content.children;
      },
      /** Preserve selected elements and caller-owned child renderers. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <ColorPickerAppearanceProvider value={appearance}>
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </ColorPickerAppearanceProvider>
  );
}

/** Render a ColorPicker with its own primitive and Zag machine. */
function ColorPickerRootImpl(props: ColorPickerRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderColorPickerRoot({ mode: 'root', props: useColorPickerRootProps(instance) }, content);
}

/** Expose a typed ColorPicker root with native element selection. */
export const ColorPickerRoot = ColorPickerRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerRootProps<As>,
) => JSX.Element;

/** Render a ColorPicker around a caller-owned primitive machine. */
function ColorPickerRootProviderImpl(props: ColorPickerRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderColorPickerRoot(
    { mode: 'provider', props: useColorPickerRootProviderProps(instance) },
    content,
  );
}

/** Require the caller's ColorPicker machine accessor. */
export const ColorPickerRootProvider = ColorPickerRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: ColorPickerRootProviderProps<As>,
) => JSX.Element;
