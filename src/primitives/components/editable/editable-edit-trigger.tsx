import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditableEditTriggerBaseProps = PolymorphicProps<'button'>;
export type EditableEditTriggerProps = Assign<HTMLProps<'button'>, EditableEditTriggerBaseProps>;

/** Render the Editable edit trigger. */
export const EditableEditTrigger = (props: EditableEditTriggerProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getEditTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
