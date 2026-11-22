import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { UseToggleProps } from './toggle-machine';
import type { ClassValue } from '../utils/class-value';

/** Forward behavior and native attributes without accepting style objects. */
export type ToggleRuntimeRootProps = UseToggleProps &
  NativeHtmlAliases & {
    unstyled?: boolean | undefined;
    class?: ClassValue | undefined;
    className?: string | undefined;
    style?: JSX.CSSProperties | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'button'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };

/** Keep indicator content and native attributes separate from styling APIs. */
export type ToggleRuntimeIndicatorProps = NativeHtmlAliases & {
  fallback?: JSX.Element | undefined;
  children?: JSX.Element | undefined;
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.CSSProperties | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'span'>['asChild'] | undefined;
};
