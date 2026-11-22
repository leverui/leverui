import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  useSliderRootProps,
  useSliderRootProviderProps,
  type SliderRootProps,
  type SliderRootProviderProps,
  type SliderRuntimeProviderProps,
  type SliderRuntimeRootProps,
} from './slider-props';
import { renderSliderRoot } from './slider-root-renderer';

/** Render a Slider with its own primitive and Zag machine. */
function SliderRootImpl(props: SliderRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSliderRootProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the current machine context. */
    get children() {
      return content.children;
    },
  });
  return renderSliderRoot({ mode: 'root', props: forwarded });
}

/** Expose a typed Slider root with caller-owned element selection. */
export const SliderRoot = SliderRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: SliderRootProps<As>,
) => JSX.Element;

/** Render a Slider driven by a caller-owned primitive machine accessor. */
function SliderRootProviderImpl(props: SliderRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSliderRootProviderProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the supplied machine context. */
    get children() {
      return content.children;
    },
  });
  return renderSliderRoot({ mode: 'provider', props: forwarded });
}

/** Expose a typed external-machine Slider root. */
export const SliderRootProvider = SliderRootProviderImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: SliderRootProviderProps<As>,
) => JSX.Element;
