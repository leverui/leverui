import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useToastContext } from './use-toast-context';

export type ToastDescriptionBaseProps = PolymorphicProps<'div'>;
export type ToastDescriptionProps = Assign<HTMLProps<'div'>, ToastDescriptionBaseProps>;

/** Render the Toast description. */
export const ToastDescription = (props: ToastDescriptionProps) => {
  const toast = useToastContext();
  const mergedProps = mergeProps(() => toast().getDescriptionProps(), props);

  return <primitive.div {...mergedProps} />;
};
