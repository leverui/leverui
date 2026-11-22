import { type JSX } from '@solidjs/web';
import type {
  CheckboxCardAlignment,
  CheckboxCardChoice,
  CheckboxCardOrientation,
  CheckboxCardSize,
  CheckboxCardVariant,
} from './checkbox-card-choices';
import type { UseCheckboxProps, UseCheckboxReturn } from './checkbox-machine';
import type {
  CheckboxChildRenderer,
  CheckboxIntrinsicElement,
  ChildCheckboxRootProps,
  NativeCheckboxRootProps,
} from './checkbox-native-root-props';

export interface CheckboxCardPresentationProps {
  /** Select Card dimensions at supported breakpoints. */
  size?: CheckboxCardChoice<CheckboxCardSize> | undefined;
  /** Select the Card's surface treatment at supported breakpoints. */
  variant?: CheckboxCardChoice<CheckboxCardVariant> | undefined;
  /** Align content and its text within the Card. */
  align?: CheckboxCardChoice<CheckboxCardAlignment> | undefined;
  /** Justify content within the Card's available space. */
  justify?: CheckboxCardChoice<CheckboxCardAlignment> | undefined;
  /** Arrange the Card control horizontally or vertically. */
  orientation?: CheckboxCardChoice<CheckboxCardOrientation> | undefined;
  /** Select inherited semantic palette variables. */
  colorPalette?: string | undefined;
  /** Suppress the authored presentation while preserving the primitive behavior. */
  unstyled?: boolean | undefined;
  /** Accept the alternate native class spelling. */
  className?: string | undefined;
}

export type CheckboxCardBaseProps = UseCheckboxProps & CheckboxCardPresentationProps;
type ProviderBaseProps = { value: UseCheckboxReturn } & CheckboxCardPresentationProps;

export type CheckboxCardRootProps<As extends CheckboxIntrinsicElement = 'label'> =
  | NativeCheckboxRootProps<As, CheckboxCardBaseProps>
  | ChildCheckboxRootProps<CheckboxCardBaseProps>;

export type CheckboxCardRootProviderProps<As extends CheckboxIntrinsicElement = 'label'> =
  NativeCheckboxRootProps<As, ProviderBaseProps> | ChildCheckboxRootProps<ProviderBaseProps>;

export type CheckboxCardRuntimeRootProps = JSX.HTMLAttributes<HTMLElement> &
  CheckboxCardBaseProps & {
    as?: CheckboxIntrinsicElement | undefined;
    asChild?: CheckboxChildRenderer | undefined;
    ref?: unknown | undefined;
  };

export type CheckboxCardRuntimeProviderProps = JSX.HTMLAttributes<HTMLElement> &
  ProviderBaseProps & {
    as?: CheckboxIntrinsicElement | undefined;
    asChild?: CheckboxChildRenderer | undefined;
    ref?: unknown | undefined;
  };
