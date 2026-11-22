import { type JSX } from '@solidjs/web';
import type { CheckmarkSize, CheckmarkVariant } from './checkmark-options';
import type { CheckmarkChoice } from './checkmark-props';
import type { UseCheckboxProps, UseCheckboxReturn } from './checkbox-machine';
import type {
  CheckboxChildRenderer,
  CheckboxIntrinsicElement,
  ChildCheckboxRootProps,
  NativeCheckboxRootProps,
} from './checkbox-native-root-props';

type CheckboxVariant = Extract<CheckmarkVariant, 'solid' | 'outline' | 'subtle'>;

export interface CheckboxPresentationProps {
  /** Select default control and label dimensions at ordinary breakpoints. */
  size?: CheckmarkChoice<CheckmarkSize> | undefined;
  /** Select a finite control treatment at ordinary breakpoints. */
  variant?: CheckmarkChoice<CheckboxVariant> | undefined;
  /** Select semantic palette variables inherited by the parts. */
  colorPalette?: string | undefined;
  /** Suppress default presentation while keeping the primitive behavior and hooks. */
  unstyled?: boolean | undefined;
  /** Accept the alternate native HTML class spelling. */
  className?: string | undefined;
}

export type CheckboxBaseProps = UseCheckboxProps & CheckboxPresentationProps;
type ProviderBaseProps = { value: UseCheckboxReturn } & CheckboxPresentationProps;

export type CheckboxRootProps<As extends CheckboxIntrinsicElement = 'label'> =
  NativeCheckboxRootProps<As, CheckboxBaseProps> | ChildCheckboxRootProps<CheckboxBaseProps>;

export type CheckboxRootProviderProps<As extends CheckboxIntrinsicElement = 'label'> =
  NativeCheckboxRootProps<As, ProviderBaseProps> | ChildCheckboxRootProps<ProviderBaseProps>;

export type CheckboxRuntimeRootProps = JSX.HTMLAttributes<HTMLElement> &
  CheckboxBaseProps & {
    as?: CheckboxIntrinsicElement | undefined;
    asChild?: CheckboxChildRenderer | undefined;
    ref?: unknown | undefined;
  };

export type CheckboxRuntimeProviderProps = JSX.HTMLAttributes<HTMLElement> &
  ProviderBaseProps & {
    as?: CheckboxIntrinsicElement | undefined;
    asChild?: CheckboxChildRenderer | undefined;
    ref?: unknown | undefined;
  };
