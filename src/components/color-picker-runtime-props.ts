import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { ColorPickerAppearance } from './color-picker-appearance';
import type { UseColorPickerReturn } from './color-picker-machine';

/** Forward machine settings while keeping appearance choices local to the root. */
export type ColorPickerRuntimeRootProps = JSX.HTMLAttributes<HTMLDivElement> &
  NativeHtmlAliases &
  ColorPickerAppearance & {
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };

/** Require an externally owned ColorPicker machine for RootProvider. */
export type ColorPickerRuntimeProviderProps = ColorPickerRuntimeRootProps & {
  value: UseColorPickerReturn;
};
