import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';

type PartPresentationProps = {
  /** Suppress the authored part default while retaining the primitive behavior. */
  unstyled?: boolean | undefined;
  /** Accept the alternate native HTML class spelling. */
  className?: string | undefined;
};

type NativePartProps<Tag extends 'div' | 'span'> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof PartPresentationProps | 'as' | 'asChild'
> &
  PartPresentationProps & { asChild?: undefined };

type ChildPartProps<Tag extends 'div' | 'span'> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof PartPresentationProps | 'as' | 'asChild' | 'ref'
> &
  PartPresentationProps & {
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type CheckboxControlProps = NativePartProps<'div'> | ChildPartProps<'div'>;
export type CheckboxLabelProps = NativePartProps<'span'> | ChildPartProps<'span'>;
