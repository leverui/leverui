import type { PolymorphicProps } from '../primitives/components/factory';
import type { RadioGroupItemProps as PrimitiveItemProps } from '../primitives/components/radio-group';
import { type JSX } from '@solidjs/web';
import type { radioCardPartTags, RadioCardPartSlot } from './radio-card-part-registry';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type ChildRenderer = NonNullable<PolymorphicProps<'div'>['asChild']>;
type PartBehavior<Slot extends RadioCardPartSlot> = Slot extends 'item'
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

export type RadioCardPartProps<
  Slot extends RadioCardPartSlot,
  As extends IntrinsicElement = (typeof radioCardPartTags)[Slot],
> =
  | NativePartProps<As, PartBehavior<Slot> & PartPresentation, (typeof radioCardPartTags)[Slot]>
  | ChildPartProps<(typeof radioCardPartTags)[Slot], PartBehavior<Slot> & PartPresentation>;

export type RadioCardLabelProps<As extends IntrinsicElement = 'span'> = RadioCardPartProps<
  'label',
  As
>;
export type RadioCardItemProps<As extends IntrinsicElement = 'label'> = RadioCardPartProps<
  'item',
  As
>;
export type RadioCardItemTextProps<As extends IntrinsicElement = 'span'> = RadioCardPartProps<
  'itemText',
  As
>;
export type RadioCardItemDescriptionProps<As extends IntrinsicElement = 'div'> = RadioCardPartProps<
  'itemDescription',
  As
>;
export type RadioCardItemControlProps<As extends IntrinsicElement = 'div'> = RadioCardPartProps<
  'itemControl',
  As
>;
export type RadioCardItemContentProps<As extends IntrinsicElement = 'div'> = RadioCardPartProps<
  'itemContent',
  As
>;
export type RadioCardItemAddonProps<As extends IntrinsicElement = 'div'> = RadioCardPartProps<
  'itemAddon',
  As
>;

type CheckedElementAttributes = Omit<JSX.HTMLAttributes<Element>, 'ref'> & {
  ref?: ((element: Element) => void) | undefined;
};

/** Render a selected custom element with element-neutral attributes. */
export type RadioCardCheckedRender = (
  getProps: (childProps?: CheckedElementAttributes) => CheckedElementAttributes,
) => JSX.Element;

type CheckedIndicatorProps = Omit<JSX.IntrinsicElements['span'], 'ref' | 'children'> &
  PartPresentation & {
    checked: RadioCardCheckedRender;
    as?: never;
    asChild?: never;
    children?: never;
    ref?: ((element: Element) => void) | undefined;
  };

export type RadioCardItemIndicatorProps<As extends IntrinsicElement = 'span'> =
  (RadioCardPartProps<'itemIndicator', As> & { checked?: never }) | CheckedIndicatorProps;
