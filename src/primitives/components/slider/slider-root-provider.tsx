import type { RootState } from '@zag-js/slider';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseSliderReturn } from './use-slider';
import { SliderProvider } from './use-slider-context';

interface RootProviderProps {
  value: UseSliderReturn;
}

export type SliderRootProviderState = RootState;

export type SliderRootProviderBaseProps = PolymorphicProps<'div', SliderRootProviderState>;
export type SliderRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  SliderRootProviderBaseProps;

/** Provide the Slider root provider to its children. */
export const SliderRootProvider = (props: SliderRootProviderProps) => {
  const [{ value: slider }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => slider().getRootProps(), localProps);

  return (
    <SliderProvider value={slider}>
      <primitive.div {...mergedProps} state={slider().getRootState()} />
    </SliderProvider>
  );
};
