import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { ClassValue } from '../utils/class-value';

/** Internal native props shared by Toast's the primitive rendering adapters. */
export type ToastRenderProps = NativeHtmlAliases & {
  unstyled?: boolean;
  class?: ClassValue;
  className?: string;
  ref?: unknown;
  as?: PrimitiveNativeTag;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element;
};
