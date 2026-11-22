import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { scrollAreaPartTags, ScrollAreaPartSlot } from './scroll-area-part-registry';

type PartAppearance = { unstyled?: boolean; className?: string } & NativeHtmlAliases;

export type ScrollAreaPartProps<
  Slot extends ScrollAreaPartSlot,
  Behavior = object,
  As extends PrimitiveNativeTag = (typeof scrollAreaPartTags)[Slot],
> = PrimitiveNativeElementProps<(typeof scrollAreaPartTags)[Slot], Behavior & PartAppearance, As>;

export type ScrollAreaViewportProps<As extends PrimitiveNativeTag = 'div'> = ScrollAreaPartProps<
  'viewport',
  object,
  As
>;
export type ScrollAreaContentProps<As extends PrimitiveNativeTag = 'div'> = ScrollAreaPartProps<
  'content',
  object,
  As
>;
export type ScrollAreaScrollbarProps<As extends PrimitiveNativeTag = 'div'> = ScrollAreaPartProps<
  'scrollbar',
  { orientation?: 'horizontal' | 'vertical' },
  As
>;
export type ScrollAreaThumbProps<As extends PrimitiveNativeTag = 'div'> = ScrollAreaPartProps<
  'thumb',
  object,
  As
>;
export type ScrollAreaCornerProps<As extends PrimitiveNativeTag = 'div'> = ScrollAreaPartProps<
  'corner',
  object,
  As
>;
