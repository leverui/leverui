import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDialogContext } from './use-dialog-context';

export type DialogCloseTriggerBaseProps = PolymorphicProps<'button'>;
export type DialogCloseTriggerProps = Assign<HTMLProps<'button'>, DialogCloseTriggerBaseProps>;

/** Render the Dialog close trigger. */
export const DialogCloseTrigger = (props: DialogCloseTriggerProps) => {
  const dialog = useDialogContext();
  const mergedProps = mergeProps(() => dialog().getCloseTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
