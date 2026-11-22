import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { tabsPartTags, TabsPartSlot } from './tabs-part-registry';

type PartBehavior<Slot extends TabsPartSlot> = Slot extends 'trigger' | 'content'
  ? { value: string }
  : object;

export type TabsPartProps<
  Slot extends TabsPartSlot,
  As extends PrimitiveNativeTag = (typeof tabsPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof tabsPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type TabsListProps<As extends PrimitiveNativeTag = 'div'> = TabsPartProps<'list', As>;
export type TabsTriggerProps<As extends PrimitiveNativeTag = 'button'> = TabsPartProps<
  'trigger',
  As
>;
export type TabsContentProps<As extends PrimitiveNativeTag = 'div'> = TabsPartProps<'content', As>;
export type TabsContentGroupProps<As extends PrimitiveNativeTag = 'div'> = TabsPartProps<
  'contentGroup',
  As
>;
export type TabsIndicatorProps<As extends PrimitiveNativeTag = 'div'> = TabsPartProps<
  'indicator',
  As
>;
