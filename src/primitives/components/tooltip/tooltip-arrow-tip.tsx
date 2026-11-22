import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTooltipContext } from './use-tooltip-context';

export type TooltipArrowTipBaseProps = PolymorphicProps<'div'>;
export type TooltipArrowTipProps = Assign<HTMLProps<'div'>, TooltipArrowTipBaseProps>;

/** Render the Tooltip arrow tip. */
export const TooltipArrowTip = (props: TooltipArrowTipProps) => {
  const api = useTooltipContext();
  const mergedProps = mergeProps(() => api().getArrowTipProps(), props);

  return <primitive.div {...mergedProps} />;
};
