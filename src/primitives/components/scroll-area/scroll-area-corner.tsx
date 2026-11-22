import type { CornerState } from '@zag-js/scroll-area';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useScrollAreaContext } from './use-scroll-area-context';

export type ScrollAreaCornerState = CornerState;

export type ScrollAreaCornerBaseProps = PolymorphicProps<'div', ScrollAreaCornerState>;
export type ScrollAreaCornerProps = Assign<HTMLProps<'div'>, ScrollAreaCornerBaseProps>;

/** Render the ScrollArea corner. */
export const ScrollAreaCorner = (props: ScrollAreaCornerProps) => {
  const scrollArea = useScrollAreaContext();
  const mergedProps = mergeProps(() => scrollArea().getCornerProps(), props);

  return <primitive.div {...mergedProps} state={scrollArea().getCornerState()} />;
};
