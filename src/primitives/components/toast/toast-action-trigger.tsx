import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useToastContext } from './use-toast-context';

export type ToastActionTriggerBaseProps = PolymorphicProps<'button'>;
export type ToastActionTriggerProps = Assign<HTMLProps<'button'>, ToastActionTriggerBaseProps>;

/** Render the Toast action trigger. */
export const ToastActionTrigger = (props: ToastActionTriggerProps) => {
  const toast = useToastContext();
  const mergedProps = mergeProps(() => toast().getActionTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
