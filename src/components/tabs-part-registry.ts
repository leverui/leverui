import { Tabs as PrimitiveTabs } from '../primitives/components/tabs';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind public Tabs parts to their default native tags. */
export const tabsPartTags = {
  list: 'div',
  trigger: 'button',
  content: 'div',
  contentGroup: 'div',
  indicator: 'div',
} as const;

export type TabsPartSlot = keyof typeof tabsPartTags;

/** Pair the primitive machine parts with the plain content-group element. */
export const tabsPartComponents = {
  list: PrimitiveTabs.List,
  trigger: PrimitiveTabs.Trigger,
  content: PrimitiveTabs.Content,
  contentGroup: primitiveNativeParts.div,
  indicator: PrimitiveTabs.Indicator,
} as const;
