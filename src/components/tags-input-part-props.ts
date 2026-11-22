import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { tagsInputPartTags, TagsInputPartSlot } from './tags-input-part-registry';

type TagsInputBehavior<Slot extends TagsInputPartSlot> = Slot extends 'item'
  ? { index: number; value: string; disabled?: boolean }
  : object;

export type TagsInputPartProps<
  Slot extends TagsInputPartSlot,
  As extends PrimitiveNativeTag = (typeof tagsInputPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof tagsInputPartTags)[Slot],
  TagsInputBehavior<Slot> & {
    unstyled?: boolean;
    className?: string;
  },
  As
>;

export type TagsInputLabelProps<As extends PrimitiveNativeTag = 'label'> = TagsInputPartProps<
  'label',
  As
>;
export type TagsInputControlProps<As extends PrimitiveNativeTag = 'div'> = TagsInputPartProps<
  'control',
  As
>;
export type TagsInputInputProps<As extends PrimitiveNativeTag = 'input'> = TagsInputPartProps<
  'input',
  As
>;
export type TagsInputItemProps<As extends PrimitiveNativeTag = 'div'> = TagsInputPartProps<
  'item',
  As
>;
export type TagsInputItemTextProps<As extends PrimitiveNativeTag = 'span'> = TagsInputPartProps<
  'itemText',
  As
>;
export type TagsInputItemDeleteTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  TagsInputPartProps<'itemDeleteTrigger', As>;
export type TagsInputItemPreviewProps<As extends PrimitiveNativeTag = 'div'> = TagsInputPartProps<
  'itemPreview',
  As
>;
export type TagsInputItemInputProps<As extends PrimitiveNativeTag = 'input'> = TagsInputPartProps<
  'itemInput',
  As
>;
export type TagsInputClearTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  TagsInputPartProps<'clearTrigger', As>;
export type TagsInputItemsProps = JSX.IntrinsicElements['div'] & {
  disabled?: boolean;
  unstyled?: boolean;
};
