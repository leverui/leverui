import { TagsInput as PrimitiveTagsInput } from '../primitives/components/tags-input';

/** Map each styled Tags Input slot to its default native element. */
export const tagsInputPartTags = {
  label: 'label',
  control: 'div',
  input: 'input',
  item: 'div',
  itemText: 'span',
  itemDeleteTrigger: 'button',
  itemPreview: 'div',
  itemInput: 'input',
  clearTrigger: 'button',
} as const;

export type TagsInputPartSlot = keyof typeof tagsInputPartTags;

/** Bind only styled slots to their corresponding primitive components. */
export const tagsInputPartComponents = {
  label: PrimitiveTagsInput.Label,
  control: PrimitiveTagsInput.Control,
  input: PrimitiveTagsInput.Input,
  item: PrimitiveTagsInput.Item,
  itemText: PrimitiveTagsInput.ItemText,
  itemDeleteTrigger: PrimitiveTagsInput.ItemDeleteTrigger,
  itemPreview: PrimitiveTagsInput.ItemPreview,
  itemInput: PrimitiveTagsInput.ItemInput,
  clearTrigger: PrimitiveTagsInput.ClearTrigger,
} as const;
