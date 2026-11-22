import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { SliderAppearance } from './slider-choices';
import type { UseSliderProps, UseSliderReturn } from './slider-machine';
import type { ClassValue } from '../utils/class-value';

export type SliderRootBaseProps = UseSliderProps & SliderAppearance;
export type SliderRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  SliderRootBaseProps & NativeHtmlAliases,
  As
>;
export type SliderRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    SliderAppearance & {
      value: UseSliderReturn;
      orientation?: 'horizontal' | 'vertical';
    } & NativeHtmlAliases,
    As
  >;

export type SliderRuntimeRootProps = SliderRootBaseProps &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: SliderRootProps['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
export type SliderRuntimeProviderProps = Omit<
  SliderRuntimeRootProps,
  keyof UseSliderProps | 'value'
> & {
  value: UseSliderReturn;
  orientation?: 'horizontal' | 'vertical' | undefined;
};

type SliderRootDefaults = Partial<SliderRootBaseProps>;

export interface SliderPropsProviderProps {
  value: SliderRootDefaults | Accessor<SliderRootDefaults>;
  children: JSX.Element;
}

const SliderPropsContext = createOptionalContext<Accessor<SliderRootDefaults>>();

/** Supply reactive machine and appearance defaults to nested Slider roots. */
export function SliderPropsProvider(props: SliderPropsProviderProps): JSX.Element {
  /** Read current defaults without owning a descendant machine. */
  function readDefaults(): SliderRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SliderPropsContext value={readDefaults}>{props.children}</SliderPropsContext>;
}

/** Merge inherited defaults before one machine-owned Slider root. */
export function useSliderRootProps(instance: SliderRuntimeRootProps): SliderRuntimeRootProps {
  const inherited = useOptionalContext(SliderPropsContext);
  return mergeProps(
    /** Follow provider changes while preserving explicit instance props. */
    () => inherited?.() ?? {},
    instance,
  ) as SliderRuntimeRootProps;
}

/** Inherit appearance without replacing a caller-owned Slider machine. */
export function useSliderRootProviderProps(
  instance: SliderRuntimeProviderProps,
): SliderRuntimeProviderProps {
  const inherited = useOptionalContext(SliderPropsContext);
  return mergeProps(
    /** Leave value and machine settings on the external accessor. */
    () => {
      const defaults = inherited?.();
      return {
        size: defaults?.size,
        variant: defaults?.variant,
        colorPalette: defaults?.colorPalette,
        unstyled: defaults?.unstyled,
      };
    },
    instance,
  ) as SliderRuntimeProviderProps;
}
