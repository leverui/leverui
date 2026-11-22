import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { RootState } from '@zag-js/toast';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useToastContext } from './use-toast-context';

export type ToastRootState = RootState;

export type ToastRootBaseProps = PolymorphicProps<'div', ToastRootState>;
export type ToastRootProps = Assign<HTMLProps<'div'>, ToastRootBaseProps>;

/** Render the Toast root. */
export const ToastRoot = (props: ToastRootProps) => {
  const toast = useToastContext();
  const mergedProps = mergeProps(() => toast().getRootProps(), props);

  return (
    <primitive.div {...mergedProps} state={toast().getRootState()}>
      <primitive.div {...toast().getGhostBeforeProps()} />
      {props.children}
      <primitive.div {...toast().getGhostAfterProps()} />
    </primitive.div>
  );
};
