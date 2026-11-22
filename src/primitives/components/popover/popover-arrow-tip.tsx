import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext } from './use-popover-context';

export type PopoverArrowTipBaseProps = PolymorphicProps<'div'>;
export type PopoverArrowTipProps = Assign<HTMLProps<'div'>, PopoverArrowTipBaseProps>;

/** Render the Popover arrow tip. */
export const PopoverArrowTip = (props: PopoverArrowTipProps) => {
  const popover = usePopoverContext();
  const mergedProps = mergeProps(() => popover().getArrowTipProps(), props);

  return <primitive.div {...mergedProps} />;
};
