import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useToastContext } from './use-toast-context';

export type ToastCloseTriggerBaseProps = PolymorphicProps<'button'>;
export type ToastCloseTriggerProps = Assign<HTMLProps<'button'>, ToastCloseTriggerBaseProps>;

/** Render the Toast close trigger. */
export const ToastCloseTrigger = (props: ToastCloseTriggerProps) => {
  const toast = useToastContext();
  const mergedProps = mergeProps(() => toast().getCloseTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
