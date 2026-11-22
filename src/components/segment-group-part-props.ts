import type { SegmentGroupItemProps as PrimitiveItemProps } from '../primitives/components/segment-group';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { segmentGroupPartTags, SegmentGroupPartSlot } from './segment-group-part-registry';

export type SegmentGroupItemElement =
  | 'label'
  | 'div'
  | 'span'
  | 'p'
  | 'article'
  | 'section'
  | 'aside'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'figure'
  | 'figcaption';

type PartBehavior<Slot extends SegmentGroupPartSlot> = Slot extends 'item'
  ? Pick<PrimitiveItemProps, 'value' | 'disabled' | 'invalid'>
  : object;
type PartAppearance = { unstyled?: boolean; className?: string } & NativeHtmlAliases;

export type SegmentGroupPartProps<
  Slot extends SegmentGroupPartSlot,
  As extends PrimitiveNativeTag = (typeof segmentGroupPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof segmentGroupPartTags)[Slot],
  PartBehavior<Slot> & PartAppearance,
  As
>;

export type SegmentGroupItemProps<As extends SegmentGroupItemElement = 'label'> =
  SegmentGroupPartProps<'item', As>;
export type SegmentGroupItemTextProps<As extends PrimitiveNativeTag = 'span'> =
  SegmentGroupPartProps<'itemText', As>;
export type SegmentGroupIndicatorProps<As extends PrimitiveNativeTag = 'div'> =
  SegmentGroupPartProps<'indicator', As>;

export interface SegmentGroupItemData {
  value: string;
  label: JSX.Element;
  disabled?: boolean;
}

export type SegmentGroupItemsProps<As extends SegmentGroupItemElement = 'label'> =
  SegmentGroupItemProps<As> extends infer Props
    ? Props extends object
      ? Omit<Props, 'value' | 'children'> & { items: Array<string | SegmentGroupItemData> }
      : never
    : never;
