import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext, usePopoverLabelParts } from './use-popover-context';

export type PopoverTitleBaseProps = PolymorphicProps<'h2'>;
export type PopoverTitleProps = Assign<HTMLProps<'h2'>, PopoverTitleBaseProps>;

/** Render the Popover title. */
export const PopoverTitle = (props: PopoverTitleProps) => {
  const api = usePopoverContext();
  usePopoverLabelParts()?.register('title');
  const mergedProps = mergeProps(() => api().getTitleProps(), props);

  return <primitive.h2 {...mergedProps} />;
};
