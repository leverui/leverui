import { type JSX } from '@solidjs/web';
import { type UseEditableContext, useEditableContext } from './use-editable-context';

export interface EditableContextProps {
  children: (context: UseEditableContext) => JSX.Element;
}

/** Render the Editable context context through a function child. */
export const EditableContext = (props: EditableContextProps) =>
  props.children(useEditableContext());
