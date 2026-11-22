import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext } from './use-popover-context';

export type PopoverCloseTriggerBaseProps = PolymorphicProps<'button'>;
export type PopoverCloseTriggerProps = Assign<HTMLProps<'button'>, PopoverCloseTriggerBaseProps>;

/** Render the Popover close trigger. */
export const PopoverCloseTrigger = (props: PopoverCloseTriggerProps) => {
  const api = usePopoverContext();
  const mergedProps = mergeProps(() => api().getCloseTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
