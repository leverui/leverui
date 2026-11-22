import type { Assign } from '../../types';
import type { RootState as AreaState } from '@zag-js/editable';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditableAreaState = AreaState;

export type EditableAreaBaseProps = PolymorphicProps<'div', EditableAreaState>;
export type EditableAreaProps = Assign<HTMLProps<'div'>, EditableAreaBaseProps>;

/** Render the Editable area. */
export const EditableArea = (props: EditableAreaProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getAreaProps(), props);

  return <primitive.div {...mergedProps} state={api().getRootState()} />;
};
