import type { Assign } from '../../types';
import type { RootState as PreviewState } from '@zag-js/editable';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useEditableContext } from './use-editable-context';

export type EditablePreviewState = PreviewState;

export type EditablePreviewBaseProps = PolymorphicProps<'span', EditablePreviewState>;
export type EditablePreviewProps = Assign<HTMLProps<'span'>, EditablePreviewBaseProps>;

/** Render the Editable preview. */
export const EditablePreview = (props: EditablePreviewProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getPreviewProps(), props);

  return <primitive.span {...mergedProps} state={api().getRootState()} />;
};
