import { type JSX } from '@solidjs/web';
import type { CheckmarkProps } from './checkmark-props';
import type { CheckboxControlProps, CheckboxLabelProps } from './checkbox-native-part-props';

export type CheckboxCardControlProps = CheckboxControlProps;
export type CheckboxCardLabelProps = CheckboxLabelProps;
export type CheckboxCardContentProps = CheckboxControlProps;
export type CheckboxCardAddonProps = CheckboxControlProps;
export type CheckboxCardDescriptionProps = CheckboxControlProps;
type IndicatorMachineProps = 'checked' | 'indeterminate' | 'disabled' | 'recipe';
type WithoutIndicatorMachine<Props> = Props extends object
  ? Omit<Props, IndicatorMachineProps>
  : never;

export type CheckboxCardIndicatorProps<As extends keyof JSX.IntrinsicElements = 'svg'> =
  WithoutIndicatorMachine<CheckmarkProps<As>>;
