import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { InputChoice, InputSize, InputVariant } from './input-appearance-options';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export interface InputBaseProps {
  /** Select authored Input geometry at supported breakpoints. */
  size?: InputChoice<InputSize> | undefined;
  /** Select an authored Input surface treatment. */
  variant?: InputChoice<InputVariant> | undefined;
  /** Select the semantic focus palette. */
  colorPalette?: string | undefined;
  /** Keep native behavior without default presentation. */
  unstyled?: boolean | undefined;
  /** Set an uncontrolled initial value without replacing later edits. */
  defaultValue?: JSX.InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  /** Add a consumer class through the `className` alias. */
  className?: string | undefined;
}

export type InputRootProps = Omit<JSX.IntrinsicElements['input'], keyof InputBaseProps | 'ref'> &
  InputBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type InputProps<As extends NativeElementTag = 'input'> = NativeElementProps<
  'input',
  InputBaseProps,
  As
>;
export type InputDefaults = Partial<
  Omit<JSX.IntrinsicElements['input'], 'ref' | 'children' | 'innerHTML' | 'size'>
> &
  InputBaseProps;

export interface InputPropsProviderProps {
  value: InputDefaults | Accessor<InputDefaults>;
  children: JSX.Element;
}

const InputContext = createOptionalContext<Accessor<InputDefaults>>();

/** Provide changing Input defaults without selecting an instance's element or ref. */
export function InputPropsProvider(props: InputPropsProviderProps): JSX.Element {
  /** Read the latest defaults from either an object or an accessor. */
  function readValue(): InputDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <InputContext value={readValue}>{props.children}</InputContext>;
}

/** Merge the nearest Input defaults with native instance props. */
export function useInputProps(instance: InputRootProps): InputRootProps {
  const inherited = useOptionalContext(InputContext);
  return mergeProps(
    /** Keep provider defaults reactive while the instance retains precedence. */
    () => inherited?.() ?? {},
    instance,
  ) as InputRootProps;
}
