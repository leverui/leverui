import {
  useEditable as usePrimitiveEditable,
  useEditableContext as usePrimitiveEditableContext,
} from '../primitives/components/editable';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  UseEditableContext,
  UseEditableProps,
  UseEditableReturn,
} from './editable-machine-types';

export type {
  EditableEditChangeDetails,
  EditableFocusOutsideEvent,
  EditableInteractOutsideEvent,
  EditablePointerDownOutsideEvent,
  EditableValueChangeDetails,
  UseEditableProps,
  UseEditableReturn,
  UseEditableContext,
} from './editable-machine-types';

export interface EditableContextProps {
  /** Render caller content against the current editing machine. */
  children: (context: UseEditableReturn) => JSX.Element;
}

/** Create a caller-owned Editable machine in the current Solid owner. */
export function useEditable(
  props?: UseEditableProps | Accessor<UseEditableProps>,
): UseEditableReturn {
  return usePrimitiveEditable(props);
}

/** Read the current Editable machine without owning a new one. */
export function useEditableContext(): UseEditableContext {
  return usePrimitiveEditableContext();
}

/** Render caller content with the nearest reactive Editable accessor. */
export function EditableContext(props: EditableContextProps): JSX.Element {
  return <>{props.children(useEditableContext())}</>;
}
