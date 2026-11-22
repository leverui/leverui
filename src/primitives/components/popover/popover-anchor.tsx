import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext } from './use-popover-context';

export type PopoverAnchorBaseProps = PolymorphicProps<'div'>;
export type PopoverAnchorProps = Assign<HTMLProps<'div'>, PopoverAnchorBaseProps>;

/** Render the Popover anchor. */
export const PopoverAnchor = (props: PopoverAnchorProps) => {
  const api = usePopoverContext();
  const mergedProps = mergeProps(() => api().getAnchorProps(), props);

  return <primitive.div {...mergedProps} />;
};
