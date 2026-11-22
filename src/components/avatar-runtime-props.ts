import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { AvatarRootBaseProps, AvatarRootProviderBaseProps } from './avatar-props';

type NativeRootProps = Omit<JSX.IntrinsicElements['div'], 'ref' | 'size'> & {
  ref?: unknown;
  as?: PrimitiveNativeTag;
  asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
};

/** Carry native, machine, and finite appearance values through the primitive's root. */
export type AvatarRuntimeRootProps = NativeRootProps & AvatarRootBaseProps;
export type AvatarRuntimeProviderProps = NativeRootProps & AvatarRootProviderBaseProps;
