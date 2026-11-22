import type { PolymorphicProps } from '../primitives/components/factory';
import type { RadioGroupItemProps as PrimitiveItemProps } from '../primitives/components/radio-group';
import { type JSX } from '@solidjs/web';
import type { radioGroupPartTags, RadioGroupPartSlot } from './radio-group-part-registry';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type ChildRenderer = NonNullable<PolymorphicProps<'div'>['asChild']>;
type PartBehavior<Slot extends RadioGroupPartSlot> = Slot extends 'item'
  ? Pick<PrimitiveItemProps, 'value' | 'disabled' | 'invalid'>
  : object;
type PartPresentation = { unstyled?: boolean | undefined; className?: string | undefined };

type NativePartProps<
  As extends IntrinsicElement,
  Base extends object,
  Default extends IntrinsicElement,
> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof Base | 'as' | 'asChild'> &
      Base &
      (As extends Default ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildPartProps<Default extends IntrinsicElement, Base extends object> = Omit<
  JSX.IntrinsicElements[Default],
  keyof Base | 'as' | 'asChild' | 'ref'
> &
  Base & {
    as?: never;
    asChild: ChildRenderer;
    ref?: ((element: Element) => void) | undefined;
  };

export type RadioGroupPartProps<
  Slot extends RadioGroupPartSlot,
  As extends IntrinsicElement = (typeof radioGroupPartTags)[Slot],
> =
  | NativePartProps<As, PartBehavior<Slot> & PartPresentation, (typeof radioGroupPartTags)[Slot]>
  | ChildPartProps<(typeof radioGroupPartTags)[Slot], PartBehavior<Slot> & PartPresentation>;

export type RadioGroupLabelProps<As extends IntrinsicElement = 'span'> = RadioGroupPartProps<
  'label',
  As
>;
export type RadioGroupItemProps<As extends IntrinsicElement = 'label'> = RadioGroupPartProps<
  'item',
  As
>;
export type RadioGroupItemTextProps<As extends IntrinsicElement = 'span'> = RadioGroupPartProps<
  'itemText',
  As
>;
export type RadioGroupItemControlProps<As extends IntrinsicElement = 'div'> = RadioGroupPartProps<
  'itemControl',
  As
>;

type IndicatorBase = Omit<PartPresentation, 'children'> & { children?: never };
type IndicatorNativeProps<As extends IntrinsicElement> = NativePartProps<As, IndicatorBase, 'span'>;
type IndicatorChildProps = ChildPartProps<'span', IndicatorBase>;

/** Keep the decorative indicator's children machine-owned. */
export type RadioGroupItemIndicatorProps<As extends IntrinsicElement = 'span'> =
  IndicatorNativeProps<As> | IndicatorChildProps;
