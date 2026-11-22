import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditableControlBaseProps = PolymorphicProps<'div'>;
export type EditableControlProps = Assign<HTMLProps<'div'>, EditableControlBaseProps>;

/** Render the Editable control. */
export const EditableControl = (props: EditableControlProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
