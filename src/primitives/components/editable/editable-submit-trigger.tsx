import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditableSubmitTriggerBaseProps = PolymorphicProps<'button'>;
export type EditableSubmitTriggerProps = Assign<
  HTMLProps<'button'>,
  EditableSubmitTriggerBaseProps
>;

/** Render the Editable submit trigger. */
export const EditableSubmitTrigger = (props: EditableSubmitTriggerProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getSubmitTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
