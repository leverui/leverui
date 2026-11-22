import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { NumberInputAppearance } from './number-input-appearance';
import type { UseNumberInputProps, UseNumberInputReturn } from './number-input-machine';

/** Carry native props and finite appearance through the primitive root boundary. */
export type NumberInputRuntimeLocalProps = Omit<
  JSX.IntrinsicElements['div'],
  keyof NumberInputAppearance | 'ref' | 'value'
> &
  NumberInputAppearance & {
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
    children?: JSX.Element | undefined;
  };

export type NumberInputRuntimeRootProps = NumberInputRuntimeLocalProps & UseNumberInputProps;
export type NumberInputRuntimeProviderProps = NumberInputRuntimeLocalProps & {
  value: UseNumberInputReturn;
};
