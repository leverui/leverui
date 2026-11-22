import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseCarouselReturn } from './use-carousel';
import { CarouselProvider } from './use-carousel-context';

interface RootProviderProps {
  value: UseCarouselReturn;
}

export type CarouselRootProviderBaseProps = PolymorphicProps<'div'>;
export type CarouselRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  CarouselRootProviderBaseProps;

/** Provide the Carousel root provider to its children. */
export const CarouselRootProvider = (props: CarouselRootProviderProps) => {
  const [{ value: carousel }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => carousel().getRootProps(), localProps);

  return (
    <CarouselProvider value={carousel}>
      <primitive.div {...mergedProps} />
    </CarouselProvider>
  );
};
