/** Map styled Pin Input parts to their default native tags. */
export const pinInputPartTags = {
  control: 'div',
  input: 'input',
  label: 'label',
} as const;

export type PinInputPartSlot = keyof typeof pinInputPartTags;
