import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useScrollAreaContext } from './use-scroll-area-context';

export type ScrollAreaViewportBaseProps = PolymorphicProps<'div'>;
export type ScrollAreaViewportProps = Assign<HTMLProps<'div'>, ScrollAreaViewportBaseProps>;

/** Render the ScrollArea viewport. */
export const ScrollAreaViewport = (props: ScrollAreaViewportProps) => {
  const scrollArea = useScrollAreaContext();
  const mergedProps = mergeProps(() => scrollArea().getViewportProps(), props);

  return <primitive.div {...mergedProps} />;
};
