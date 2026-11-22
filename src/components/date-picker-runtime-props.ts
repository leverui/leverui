import type { PolymorphicProps } from '../primitives/components/factory';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { DatePickerAppearance } from './date-picker-appearance';
import type { UseDatePickerProps, UseDatePickerReturn } from './date-picker-machine';
import type { ClassValue } from '../utils/class-value';

/** Keep the primitive machine, appearance, and native root attributes separate. */
export type DatePickerRuntimeRootProps = UseDatePickerProps &
  UsePresenceProps &
  DatePickerAppearance &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };

/** Require an external machine while inheriting presentation options. */
export type DatePickerRuntimeProviderProps = Omit<
  DatePickerRuntimeRootProps,
  keyof UseDatePickerProps
> & { value: UseDatePickerReturn };
