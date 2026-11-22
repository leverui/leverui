import type { RatingGroupItemProps as PrimitiveItemProps } from '../primitives/components/rating-group';
import { type Component } from 'solid-js';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ratingGroupPartTags, RatingGroupPartSlot } from './rating-group-part-registry';

type PartBehavior<Slot extends RatingGroupPartSlot> = Slot extends 'item'
  ? Pick<PrimitiveItemProps, 'index'>
  : object;
type PartAppearance = { unstyled?: boolean; className?: string } & NativeHtmlAliases;

export type RatingGroupPartProps<
  Slot extends RatingGroupPartSlot,
  As extends PrimitiveNativeTag = (typeof ratingGroupPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof ratingGroupPartTags)[Slot],
  PartBehavior<Slot> & PartAppearance,
  As
>;

export type RatingGroupLabelProps<As extends PrimitiveNativeTag = 'label'> = RatingGroupPartProps<
  'label',
  As
>;
export type RatingGroupItemProps<As extends PrimitiveNativeTag = 'span'> = RatingGroupPartProps<
  'item',
  As
>;
export type RatingGroupControlProps<As extends PrimitiveNativeTag = 'div'> = RatingGroupPartProps<
  'control',
  As
>;
export type RatingGroupItemsProps<As extends PrimitiveNativeTag = 'span'> = Omit<
  RatingGroupItemProps<As>,
  'index' | 'children'
>;

/** Render a fresh SVG for each background and foreground layer. */
/**
 * The props a rating icon receives: the layer marker and `aria-hidden`. Kept
 * this narrow so icon components from libraries such as Lucide fit.
 */
export type RatingGroupIconProps = {
  'data-bg'?: string;
  'data-fg'?: string;
  'aria-hidden'?: 'true';
};
export type RatingGroupIcon = Component<RatingGroupIconProps>;

type IndicatorBehavior = PartAppearance & { icon?: RatingGroupIcon; children?: never };

/** Support native, selected, and caller-owned indicator elements. */
export type RatingGroupItemIndicatorProps<As extends PrimitiveNativeTag = 'span'> =
  PrimitiveNativeElementProps<'span', IndicatorBehavior, As>;
