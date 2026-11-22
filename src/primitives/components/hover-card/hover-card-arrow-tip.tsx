import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useHoverCardContext } from './use-hover-card-context';

export type HoverCardArrowTipBaseProps = PolymorphicProps<'div'>;
export type HoverCardArrowTipProps = Assign<HTMLProps<'div'>, HoverCardArrowTipBaseProps>;

/** Render the HoverCard arrow tip. */
export const HoverCardArrowTip = (props: HoverCardArrowTipProps) => {
  const hoverCard = useHoverCardContext();
  const mergedProps = mergeProps(() => hoverCard().getArrowTipProps(), props);

  return <primitive.div {...mergedProps} />;
};
