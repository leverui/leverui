import type { ScrollbarProps, ScrollbarState } from '@zag-js/scroll-area';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useScrollAreaContext } from './use-scroll-area-context';
import { ScrollAreaScrollbarProvider } from './use-scroll-area-scrollbar-context';

export type ScrollAreaScrollbarState = ScrollbarState;

export type ScrollAreaScrollbarBaseProps = ScrollbarProps &
  PolymorphicProps<'div', ScrollAreaScrollbarState>;
export type ScrollAreaScrollbarProps = Assign<HTMLProps<'div'>, ScrollAreaScrollbarBaseProps>;

/** Render the ScrollArea scrollbar. */
export const ScrollAreaScrollbar = (props: ScrollAreaScrollbarProps) => {
  const [scrollbarProps, localProps] = createSplitProps<ScrollbarProps>()(props, ['orientation']);
  const scrollArea = useScrollAreaContext();
  const mergedProps = mergeProps(() => scrollArea().getScrollbarProps(scrollbarProps), localProps);

  return (
    <ScrollAreaScrollbarProvider value={scrollbarProps}>
      <primitive.div {...mergedProps} state={scrollArea().getScrollbarState(scrollbarProps)} />
    </ScrollAreaScrollbarProvider>
  );
};
