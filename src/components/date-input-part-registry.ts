import { DateInput as PrimitiveDateInput } from '../primitives/components/date-input';

/** Bind each public styled part to its primitive behavior. */
export const dateInputPartComponents = {
  control: PrimitiveDateInput.Control,
  hiddenInput: PrimitiveDateInput.HiddenInput,
  label: PrimitiveDateInput.Label,
  segment: PrimitiveDateInput.Segment,
  segmentGroup: PrimitiveDateInput.SegmentGroup,
} as const;

/** Match the native element rendered by each primitive part. */
export const dateInputPartTags = {
  control: 'div',
  hiddenInput: 'input',
  label: 'label',
  segment: 'span',
  segmentGroup: 'div',
} as const;

export type DateInputPartSlot = keyof typeof dateInputPartComponents;
