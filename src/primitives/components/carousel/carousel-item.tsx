import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/carousel';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselItemState = ItemState;

export type CarouselItemBaseProps = ItemProps & PolymorphicProps<'div', CarouselItemState>;
export type CarouselItemProps = Assign<HTMLProps<'div'>, CarouselItemBaseProps>;

/** Render the Carousel item. */
export const CarouselItem = (props: CarouselItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index', 'snapAlign']);
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps);

  return <primitive.div {...mergedProps} state={api().getItemState(itemProps)} />;
};
