import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

export type CheckboxIntrinsicElement = keyof JSX.IntrinsicElements;
export type CheckboxChildRenderer = NonNullable<PolymorphicProps<'label'>['asChild']>;

/** Preserve native element props and the chosen root tag's ref contract. */
export type NativeCheckboxRootProps<
  As extends CheckboxIntrinsicElement,
  Base extends object,
> = As extends CheckboxIntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof Base | 'as' | 'asChild'> &
      Base &
      (As extends 'label' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

/** Preserve the primitive's caller-rendered label with a native element ref. */
export type ChildCheckboxRootProps<Base extends object> = Omit<
  JSX.IntrinsicElements['label'],
  keyof Base | 'as' | 'asChild' | 'ref'
> &
  Base & {
    as?: never;
    asChild: CheckboxChildRenderer;
    ref?: ((element: HTMLElement) => void) | undefined;
  };
