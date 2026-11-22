import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useHoverCardContext } from './use-hover-card-context';

export type HoverCardArrowBaseProps = PolymorphicProps<'div'>;
export type HoverCardArrowProps = Assign<HTMLProps<'div'>, HoverCardArrowBaseProps>;

/** Render the HoverCard arrow. */
export const HoverCardArrow = (props: HoverCardArrowProps) => {
  const hoverCard = useHoverCardContext();
  const mergedProps = mergeProps(() => hoverCard().getArrowProps(), props);

  return <primitive.div {...mergedProps} />;
};
