import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useToastContext } from './use-toast-context';

export type ToastContentBaseProps = PolymorphicProps<'div'>;
export type ToastContentProps = Assign<HTMLProps<'div'>, ToastContentBaseProps>;

/** Wraps the toast's title and description so its height keeps updating after mount. */
export const ToastContent = (props: ToastContentProps) => {
  const toast = useToastContext();
  const mergedProps = mergeProps(() => toast().getContentProps(), props);

  return <primitive.div {...mergedProps} />;
};
