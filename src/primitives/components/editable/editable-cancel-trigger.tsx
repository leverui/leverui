import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditableCancelTriggerBaseProps = PolymorphicProps<'button'>;
export type EditableCancelTriggerProps = Assign<
  HTMLProps<'button'>,
  EditableCancelTriggerBaseProps
>;

/** Render the Editable cancel trigger. */
export const EditableCancelTrigger = (props: EditableCancelTriggerProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getCancelTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
