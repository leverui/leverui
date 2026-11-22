import { type JSX } from '@solidjs/web';
import { type UseSliderContext, useSliderContext } from './use-slider-context';

export interface SliderContextProps {
  children: (context: UseSliderContext) => JSX.Element;
}

/** Render the Slider context context through a function child. */
export const SliderContext = (props: SliderContextProps) => props.children(useSliderContext());
