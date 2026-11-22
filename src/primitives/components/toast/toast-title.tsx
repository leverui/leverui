import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useToastContext } from './use-toast-context';

export type ToastTitleBaseProps = PolymorphicProps<'div'>;
export type ToastTitleProps = Assign<HTMLProps<'div'>, ToastTitleBaseProps>;

/** Render the Toast title. */
export const ToastTitle = (props: ToastTitleProps) => {
  const toast = useToastContext();
  const mergedProps = mergeProps(() => toast().getTitleProps(), props);

  return <primitive.div {...mergedProps} />;
};
