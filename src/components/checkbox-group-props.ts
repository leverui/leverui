import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { UseCheckboxGroupProps } from './checkbox-group-machine-types';

type IntrinsicElement = keyof JSX.IntrinsicElements;

type GroupPresentationProps = {
  /** Suppress the default group layout while preserving the primitive behavior. */
  unstyled?: boolean | undefined;
  /** Add a native class through the alternate HTML naming convention. */
  className?: string | undefined;
};

type GroupBaseProps = UseCheckboxGroupProps & GroupPresentationProps;

type NativeGroupProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof GroupBaseProps | 'as' | 'asChild'> &
      GroupBaseProps &
      (As extends 'div' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildGroupProps = Omit<
  JSX.IntrinsicElements['div'],
  keyof GroupBaseProps | 'as' | 'asChild' | 'ref'
> &
  GroupBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

/** Expose the primitive selection behavior with native elements and CSS hooks. */
export type CheckboxGroupProps<As extends IntrinsicElement = 'div'> =
  NativeGroupProps<As> | ChildGroupProps;

export type CheckboxGroupRuntimeProps = JSX.HTMLAttributes<HTMLElement> &
  GroupBaseProps & {
    as?: IntrinsicElement | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
