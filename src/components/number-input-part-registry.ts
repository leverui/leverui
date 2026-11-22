/** Map Number Input parts to their default native tags. */
export const numberInputPartTags = {
  control: 'div',
  decrementTrigger: 'button',
  hiddenInput: 'input',
  incrementTrigger: 'button',
  input: 'input',
  label: 'label',
  scrubber: 'div',
  valueText: 'span',
} as const;

export type NumberInputPartSlot = keyof typeof numberInputPartTags;
