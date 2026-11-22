import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ColorPickerAppearance } from './color-picker-appearance';
import type { UseColorPickerProps, UseColorPickerReturn } from './color-picker-machine';
import { mergeRecipeProps } from './recipe-props-merge';

type ColorPickerMachineProps = UseColorPickerProps & UsePresenceProps;

export type ColorPickerRootBaseProps = ColorPickerMachineProps & ColorPickerAppearance;
export type ColorPickerRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    ColorPickerMachineProps & ColorPickerAppearance & NativeHtmlAliases,
    As
  >;
export type ColorPickerRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    { value: UseColorPickerReturn } & UsePresenceProps & ColorPickerAppearance & NativeHtmlAliases,
    As
  >;

export interface ColorPickerPropsProviderProps {
  value: Partial<ColorPickerRootBaseProps> | Accessor<Partial<ColorPickerRootBaseProps>>;
  children: JSX.Element;
}

const ColorPickerPropsContext = createOptionalContext<Accessor<object>>();

/** Supply reactive machine and appearance defaults to descendant roots. */
export function ColorPickerPropsProvider(props: ColorPickerPropsProviderProps): JSX.Element {
  /** Read the latest defaults without creating a color-picker machine. */
  function readDefaults(): object {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ColorPickerPropsContext value={readDefaults}>{props.children}</ColorPickerPropsContext>;
}

/** Merge inherited defaults before the primitive constructs a ColorPicker machine. */
export function useColorPickerRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ColorPickerPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep explicit instance machine props above inherited defaults. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Inherit appearance without replacing the caller-owned machine. */
export function useColorPickerRootProviderProps<
  Props extends ColorPickerAppearance & { value: UseColorPickerReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(ColorPickerPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep color value, open state, and callbacks on the external accessor. */
    () => {
      const defaults = (inherited?.() ?? {}) as Partial<ColorPickerAppearance>;
      return {
        size: defaults.size,
        variant: defaults.variant,
        unstyled: defaults.unstyled,
      } as Partial<Props>;
    },
    instance,
  );
}
