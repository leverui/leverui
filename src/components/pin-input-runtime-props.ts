import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { UsePinInputProps, UsePinInputReturn } from './pin-input-machine';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { PinInputAppearance } from './pin-input-appearance';
import type { ClassValue } from '../utils/class-value';

/** Carry checked native root props through the primitive boundary. */
export type PinInputRuntimeLocalProps = NativeHtmlAliases &
  PinInputAppearance & {
    class?: ClassValue | undefined;
    style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
    children?: JSX.Element | undefined;
  };

export type PinInputRuntimeRootProps = PinInputRuntimeLocalProps & UsePinInputProps;
export type PinInputRuntimeProviderProps = PinInputRuntimeLocalProps & { value: UsePinInputReturn };
