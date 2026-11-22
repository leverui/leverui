import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { DateInputAppearance } from './date-input-appearance';
import type { UseDateInputProps, UseDateInputReturn } from './date-input-machine';
import type { ClassValue } from '../utils/class-value';

/** Keep the machine contract distinct from finite native presentation. */
export type DateInputRuntimeRootProps = UseDateInputProps &
  NativeHtmlAliases &
  DateInputAppearance & {
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };

/** Require the caller's the primitive date machine for a provider-owned root. */
export type DateInputRuntimeProviderProps = Omit<
  DateInputRuntimeRootProps,
  keyof UseDateInputProps
> & {
  value: UseDateInputReturn;
};
