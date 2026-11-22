import type { EditableElementProps, EditableIntrinsicElement } from './editable-types';
import type { editablePartTags, EditablePartSlot } from './editable-part-tags';

export type EditablePartProps<
  Slot extends EditablePartSlot,
  As extends EditableIntrinsicElement = (typeof editablePartTags)[Slot],
> = EditableElementProps<(typeof editablePartTags)[Slot], As>;

export type EditableAreaProps<As extends EditableIntrinsicElement = 'div'> = EditablePartProps<
  'area',
  As
>;
export type EditableCancelTriggerProps<As extends EditableIntrinsicElement = 'button'> =
  EditablePartProps<'cancelTrigger', As>;
export type EditableControlProps<As extends EditableIntrinsicElement = 'div'> = EditablePartProps<
  'control',
  As
>;
export type EditableEditTriggerProps<As extends EditableIntrinsicElement = 'button'> =
  EditablePartProps<'editTrigger', As>;
export type EditableInputProps<As extends EditableIntrinsicElement = 'input'> = EditablePartProps<
  'input',
  As
>;
export type EditableLabelProps<As extends EditableIntrinsicElement = 'label'> = EditablePartProps<
  'label',
  As
>;
export type EditablePreviewProps<As extends EditableIntrinsicElement = 'span'> = EditablePartProps<
  'preview',
  As
>;
export type EditableSubmitTriggerProps<As extends EditableIntrinsicElement = 'button'> =
  EditablePartProps<'submitTrigger', As>;
export type EditableTextareaProps<As extends EditableIntrinsicElement = 'textarea'> =
  EditablePartProps<'textarea', As>;
