import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useScrollAreaContext } from './use-scroll-area-context';

export type ScrollAreaContentBaseProps = PolymorphicProps<'div'>;
export type ScrollAreaContentProps = Assign<HTMLProps<'div'>, ScrollAreaContentBaseProps>;

/** Render the ScrollArea content. */
export const ScrollAreaContent = (props: ScrollAreaContentProps) => {
  const scrollArea = useScrollAreaContext();
  const mergedProps = mergeProps(() => scrollArea().getContentProps(), props);

  return <primitive.div {...mergedProps} />;
};
