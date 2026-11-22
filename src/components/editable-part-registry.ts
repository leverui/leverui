import { Editable as PrimitiveEditable } from '../primitives/components/editable';
import type { EditablePartSlot } from './editable-part-tags';
import { EditableTextareaPrimitive } from './editable-textarea-primitive';

export const editablePartComponents = {
  area: PrimitiveEditable.Area,
  cancelTrigger: PrimitiveEditable.CancelTrigger,
  control: PrimitiveEditable.Control,
  editTrigger: PrimitiveEditable.EditTrigger,
  input: PrimitiveEditable.Input,
  label: PrimitiveEditable.Label,
  preview: PrimitiveEditable.Preview,
  submitTrigger: PrimitiveEditable.SubmitTrigger,
  textarea: EditableTextareaPrimitive,
} as const satisfies Record<EditablePartSlot, unknown>;
