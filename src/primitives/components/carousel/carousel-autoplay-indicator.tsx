import type { Assign } from '../../types';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { carouselAnatomy } from './carousel.anatomy';
import { useCarouselContext } from './use-carousel-context';

const parts = carouselAnatomy.build();

export interface CarouselAutoplayIndicatorBaseProps extends PolymorphicProps<'span'> {
  /**
   * The fallback content to render when autoplay is paused.
   */
  fallback?: JSX.Element;
}
export type CarouselAutoplayIndicatorProps = Assign<
  HTMLProps<'span'>,
  CarouselAutoplayIndicatorBaseProps
>;

/** Render the Carousel autoplay indicator. */
export const CarouselAutoplayIndicator = (props: CarouselAutoplayIndicatorProps) => {
  const api = useCarouselContext();
  return (
    <primitive.span {...parts.autoplayIndicator.attrs('')} {...props}>
      <Show when={api().isPlaying} fallback={props.fallback}>
        {props.children}
      </Show>
    </primitive.span>
  );
};
