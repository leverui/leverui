import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext } from './use-popover-context';

export type PopoverArrowBaseProps = PolymorphicProps<'div'>;
export type PopoverArrowProps = Assign<HTMLProps<'div'>, PopoverArrowBaseProps>;

/** Render the Popover arrow. */
export const PopoverArrow = (props: PopoverArrowProps) => {
  const popover = usePopoverContext();
  const mergedProps = mergeProps(() => popover().getArrowProps(), props);

  return <primitive.div {...mergedProps} />;
};
