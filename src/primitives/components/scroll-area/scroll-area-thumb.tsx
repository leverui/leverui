import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useScrollAreaContext } from './use-scroll-area-context';
import { useScrollAreaScrollbarContext } from './use-scroll-area-scrollbar-context';

export type ScrollAreaThumbBaseProps = PolymorphicProps<'div'>;
export type ScrollAreaThumbProps = Assign<HTMLProps<'div'>, ScrollAreaThumbBaseProps>;

/** Render the ScrollArea thumb. */
export const ScrollAreaThumb = (props: ScrollAreaThumbProps) => {
  const scrollAreaApi = useScrollAreaContext();
  const scrollbarProps = useScrollAreaScrollbarContext();

  const mergedProps = mergeProps(() => scrollAreaApi().getThumbProps(scrollbarProps), props);

  return <primitive.div {...mergedProps} />;
};
