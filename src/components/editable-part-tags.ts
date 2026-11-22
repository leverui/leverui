export const editablePartTags = {
  area: 'div',
  cancelTrigger: 'button',
  control: 'div',
  editTrigger: 'button',
  input: 'input',
  label: 'label',
  preview: 'span',
  submitTrigger: 'button',
  textarea: 'textarea',
} as const;

export type EditablePartSlot = keyof typeof editablePartTags;
