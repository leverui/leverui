import type * as ZagToast from '@zag-js/toast';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { CreateToasterReturn, ToastOptions } from './toast-store';

type ToastAppearance = { unstyled?: boolean; className?: string };

export type ToastRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  ToastAppearance,
  As
>;
export type ToastContentProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  ToastAppearance,
  As
>;
export type ToastTitleProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  ToastAppearance,
  As
>;
export type ToastDescriptionProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', ToastAppearance, As>;
export type ToastActionTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<'button', ToastAppearance, As>;
export type ToastCloseTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<'button', ToastAppearance, As>;
export type ToastIndicatorProps = JSX.IntrinsicElements['svg'] & ToastAppearance;

type ToasterBehavior<T> = Omit<ZagToast.GroupProps, 'id' | 'store'> &
  ToastAppearance & {
    toaster: CreateToasterReturn<T>;
    children: (toast: Accessor<ToastOptions<T>>) => JSX.Element;
    label?: string;
  };

/**
 * Props for the notification region. The region is not polymorphic:
 * its children belong to the toast machine, so it always renders a `div`.
 */
export type ToasterProps<T = JSX.Element> = Omit<
  JSX.IntrinsicElements['div'],
  keyof ToasterBehavior<T> | 'children'
> &
  ToasterBehavior<T>;
