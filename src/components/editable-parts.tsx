import { type JSX } from '@solidjs/web';
import { renderEditablePart } from './editable-part';
import type {
  EditableAreaProps,
  EditableCancelTriggerProps,
  EditableControlProps,
  EditableEditTriggerProps,
  EditableInputProps,
  EditableLabelProps,
  EditablePreviewProps,
  EditableSubmitTriggerProps,
  EditableTextareaProps,
} from './editable-part-props';
import type { EditableIntrinsicElement } from './editable-types';

/** Group the preview and editing control under Zag's area semantics. */
export function EditableArea<As extends EditableIntrinsicElement = 'div'>(
  props: EditableAreaProps<As>,
): JSX.Element {
  return renderEditablePart<'area', As>('area', props);
}

/** Revert the current draft and return to preview mode. */
export function EditableCancelTrigger<As extends EditableIntrinsicElement = 'button'>(
  props: EditableCancelTriggerProps<As>,
): JSX.Element {
  return renderEditablePart<'cancelTrigger', As>('cancelTrigger', props);
}

/** Group edit, submit, and cancel actions. */
export function EditableControl<As extends EditableIntrinsicElement = 'div'>(
  props: EditableControlProps<As>,
): JSX.Element {
  return renderEditablePart<'control', As>('control', props);
}

/** Enter edit mode through the primitive's activation behavior. */
export function EditableEditTrigger<As extends EditableIntrinsicElement = 'button'>(
  props: EditableEditTriggerProps<As>,
): JSX.Element {
  return renderEditablePart<'editTrigger', As>('editTrigger', props);
}

/** Edit the machine value in a native single-line input. */
export function EditableInput<As extends EditableIntrinsicElement = 'input'>(
  props: EditableInputProps<As>,
): JSX.Element {
  return renderEditablePart<'input', As>('input', props);
}

/** Associate visible text with the Editable input. */
export function EditableLabel<As extends EditableIntrinsicElement = 'label'>(
  props: EditableLabelProps<As>,
): JSX.Element {
  return renderEditablePart<'label', As>('label', props);
}

/** Show the committed value or placeholder outside edit mode. */
export function EditablePreview<As extends EditableIntrinsicElement = 'span'>(
  props: EditablePreviewProps<As>,
): JSX.Element {
  return renderEditablePart<'preview', As>('preview', props);
}

/** Commit the draft value and return to preview mode. */
export function EditableSubmitTrigger<As extends EditableIntrinsicElement = 'button'>(
  props: EditableSubmitTriggerProps<As>,
): JSX.Element {
  return renderEditablePart<'submitTrigger', As>('submitTrigger', props);
}

/** Edit the machine value in a native multiline textarea. */
export function EditableTextarea<As extends EditableIntrinsicElement = 'textarea'>(
  props: EditableTextareaProps<As>,
): JSX.Element {
  return renderEditablePart<'textarea', As>('textarea', props);
}
