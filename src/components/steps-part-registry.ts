import { Steps as PrimitiveSteps } from '../primitives/components/steps';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind public Steps parts to their default native tags. */
export const stepsPartTags = {
  list: 'div',
  item: 'div',
  trigger: 'button',
  content: 'div',
  completedContent: 'div',
  title: 'div',
  description: 'div',
  separator: 'div',
  indicator: 'div',
  nextTrigger: 'button',
  prevTrigger: 'button',
} as const;

export type StepsPartSlot = keyof typeof stepsPartTags;

/** Pair the primitive machine parts with native elements for presentation-only slots. */
export const stepsPartComponents = {
  list: PrimitiveSteps.List,
  item: PrimitiveSteps.Item,
  trigger: PrimitiveSteps.Trigger,
  content: PrimitiveSteps.Content,
  completedContent: PrimitiveSteps.CompletedContent,
  title: primitiveNativeParts.div,
  description: primitiveNativeParts.div,
  separator: PrimitiveSteps.Separator,
  indicator: PrimitiveSteps.Indicator,
  nextTrigger: PrimitiveSteps.NextTrigger,
  prevTrigger: PrimitiveSteps.PreviousTrigger,
} as const;
