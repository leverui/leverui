import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext, usePopoverLabelParts } from './use-popover-context';

export type PopoverDescriptionBaseProps = PolymorphicProps<'div'>;
export type PopoverDescriptionProps = Assign<HTMLProps<'div'>, PopoverDescriptionBaseProps>;

/** Render the Popover description. */
export const PopoverDescription = (props: PopoverDescriptionProps) => {
  const api = usePopoverContext();
  usePopoverLabelParts()?.register('description');
  const mergedProps = mergeProps(() => api().getDescriptionProps(), props);

  return <primitive.div {...mergedProps} />;
};
