import { splitProps } from '../primitives/utils/split-props';
import { Slider as PrimitiveSlider } from '../primitives/components/slider';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { SliderAppearanceProvider, type SliderAppearanceState } from './slider-appearance';
import { sliderAttributes } from './slider-choices';
import type { SliderRuntimeProviderProps, SliderRuntimeRootProps } from './slider-props';

type RootInput =
  | { mode: 'root'; props: SliderRuntimeRootProps }
  | { mode: 'provider'; props: SliderRuntimeProviderProps };

/** Bind stable CSS hooks around either primitive Slider machine root. */
export function renderSliderRoot(input: RootInput): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveSlider.Root : PrimitiveSlider.RootProvider;
  const [content, local, native] = splitProps(
    input.props,
    ['children'],
    [
      'size',
      'variant',
      'orientation',
      'colorPalette',
      'unstyled',
      'class',
      'className',
      'ref',
      'as',
      'asChild',
      ...nativeHtmlAliasNames,
    ],
  );
  const appearance: SliderAppearanceState = {
    /** Follow the root's changing unstyled choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Give only a machine-owned root its orientation setting. */
    () => (input.mode === 'root' ? { orientation: local.orientation } : {}),
    /** Keep machine options and native attributes reactive. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite appearance choices without browser style generation. */
    () => sliderAttributes(local),
    {
      /** Preserve the external machine's visual orientation by default. */
      get 'data-orientation'() {
        if (input.mode !== 'provider') return undefined;
        if (local.orientation) return local.orientation;
        const attributes = input.props.value().getRootProps();
        return 'data-orientation' in attributes ? attributes['data-orientation'] : undefined;
      },
      /** Forward a native ref to the selected root element. */
      get ref() {
        return local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('slider__root', undefined, local.class, local.className);
      },
      /** Keep compound parts beneath the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <SliderAppearanceProvider value={appearance}>
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </SliderAppearanceProvider>
  );
}
