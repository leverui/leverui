import { Clipboard as PrimitiveClipboard } from '../primitives/components/clipboard';

/** Bind each Clipboard slot to its native element. */
export const clipboardPartTags = {
  trigger: 'button',
  control: 'div',
  indicator: 'div',
  input: 'input',
  label: 'label',
  valueText: 'span',
} as const;

export type ClipboardPartSlot = keyof typeof clipboardPartTags;

/** Keep copying and status behavior in the primitive while Lever UI styles its parts. */
export const clipboardPartComponents = {
  trigger: PrimitiveClipboard.Trigger,
  control: PrimitiveClipboard.Control,
  indicator: PrimitiveClipboard.Indicator,
  input: PrimitiveClipboard.Input,
  label: PrimitiveClipboard.Label,
  valueText: PrimitiveClipboard.ValueText,
} as const;
