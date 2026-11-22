import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseCarouselProps, useCarousel } from './use-carousel';
import { CarouselProvider } from './use-carousel-context';

export type CarouselRootBaseProps = UseCarouselProps & PolymorphicProps<'div'>;
export type CarouselRootProps = Assign<HTMLProps<'div'>, CarouselRootBaseProps>;

/** Render the Carousel root. */
export const CarouselRoot = (props: CarouselRootProps) => {
  const [useCarouselProps, localProps] = createSplitProps<UseCarouselProps>()(props, [
    'allowMouseDrag',
    'autoPlay',
    'autoSize',
    'count',
    'defaultPage',
    'id',
    'ids',
    'inViewThreshold',
    'itemSpacing',
    'loop',
    'onAutoplayStatusChange',
    'onDragStatusChange',
    'onPageChange',
    'orientation',
    'page',
    'slidesPerMove',
    'slidesPerPage',
    'snapType',
    'spacing',
    'translations',
  ]);
  const api = useCarousel(useCarouselProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <CarouselProvider value={api}>
      <primitive.div {...mergedProps} />
    </CarouselProvider>
  );
};
