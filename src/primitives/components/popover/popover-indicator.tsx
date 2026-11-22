import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePopoverContext } from './use-popover-context';

export type PopoverIndicatorBaseProps = PolymorphicProps<'span'>;
export type PopoverIndicatorProps = Assign<HTMLProps<'span'>, PopoverIndicatorBaseProps>;

/** Render the Popover indicator. */
export const PopoverIndicator = (props: PopoverIndicatorProps) => {
  const popover = usePopoverContext();
  const mergedProps = mergeProps(() => popover().getIndicatorProps(), props);

  return <primitive.span {...mergedProps} />;
};
