import type { Assign } from '../../types';
import { createMemo } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { carouselAnatomy } from './carousel.anatomy';
import { useCarouselContext } from './use-carousel-context';

const parts = carouselAnatomy.build();

export type CarouselProgressTextBaseProps = PolymorphicProps<'span'>;
export type CarouselProgressTextProps = Assign<HTMLProps<'span'>, CarouselProgressTextBaseProps>;

/** Render the Carousel progress text. */
export const CarouselProgressText = (props: CarouselProgressTextProps) => {
  const api = useCarouselContext();

  const progressText = createMemo(() => {
    const currentPage = api().page + 1;
    const totalPages = api().pageSnapPoints.length;
    return `${currentPage} / ${totalPages}`;
  });

  return (
    <primitive.span {...parts.progressText.attrs('')} {...props}>
      {props.children || progressText()}
    </primitive.span>
  );
};
