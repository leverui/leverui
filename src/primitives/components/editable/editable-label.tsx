import type { Assign } from '../../types';
import type { RootState as LabelState } from '@zag-js/editable';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditableLabelState = LabelState;

export type EditableLabelBaseProps = PolymorphicProps<'label', EditableLabelState>;
export type EditableLabelProps = Assign<HTMLProps<'label'>, EditableLabelBaseProps>;

/** Render the Editable label. */
export const EditableLabel = (props: EditableLabelProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} state={api().getRootState()} />;
};
