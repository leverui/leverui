export { SwitchRoot as Root, SwitchRootProvider as RootProvider } from './switch-root';
export { SwitchPropsProvider as PropsProvider } from './switch-props';
export {
  SwitchControl as Control,
  SwitchLabel as Label,
  SwitchThumb as Thumb,
} from './switch-parts';
export {
  SwitchIndicator as Indicator,
  SwitchThumbIndicator as ThumbIndicator,
} from './switch-indicators';
export { SwitchContext as Context, SwitchHiddenInput as HiddenInput } from './switch-machine';
export { useSwitch, useSwitchContext } from './switch-machine';
export type {
  SwitchRootProps as RootProps,
  SwitchRootProviderProps as RootProviderProps,
  SwitchPropsProviderProps as PropsProviderProps,
} from './switch-props';
export type {
  SwitchControlProps as ControlProps,
  SwitchLabelProps as LabelProps,
  SwitchThumbProps as ThumbProps,
  SwitchIndicatorProps as IndicatorProps,
  SwitchThumbIndicatorProps as ThumbIndicatorProps,
} from './switch-part-props';
export type {
  SwitchCheckedChangeDetails as CheckedChangeDetails,
  UseSwitchProps,
  UseSwitchReturn,
} from './switch-machine';
