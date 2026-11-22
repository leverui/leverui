import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTooltipContext } from './use-tooltip-context';

export type TooltipArrowBaseProps = PolymorphicProps<'div'>;
export type TooltipArrowProps = Assign<HTMLProps<'div'>, TooltipArrowBaseProps>;

/** Render the Tooltip arrow. */
export const TooltipArrow = (props: TooltipArrowProps) => {
  const tooltip = useTooltipContext();
  const mergedProps = mergeProps(() => tooltip().getArrowProps(), props);

  return <primitive.div {...mergedProps} />;
};
