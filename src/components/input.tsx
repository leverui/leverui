import { splitProps } from '../primitives/utils/split-props';
import { Field as PrimitiveField, type FieldInputProps } from '../primitives/components/field';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, isServer } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { omit } from '../utils/omit';
import { inputAppearanceAttributes } from './input-appearance-attributes';
import { useInputProps, type InputProps, type InputRootProps } from './input-props';
import type { NativeElementTag } from './native-element-props';

/** Render a selected native control without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render the primitive Field semantics with authored CSS appearance attributes. */
function InputRoot(props: InputRootProps): JSX.Element {
  const merged = useInputProps(props);
  const [local, rest] = splitProps(merged, [
    'as',
    'asChild',
    'defaultValue',
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'ref',
    'class',
    'className',
    'children',
  ]);
  const initialDefaultValue = untrack(
    /** Keep an uncontrolled initial value stable as other props change. */
    () => local.defaultValue,
  );
  const nativeProps = createMemo(
    /** Keep native value and reset semantics stable through reactive updates. */
    () => {
      const native = { ...rest, children: local.children };
      const controlled = native.value !== undefined;
      const value = controlled ? native.value : initialDefaultValue;
      if (value === undefined) return native;
      // Solid 2 reasserts `value` whenever these props update, so only a
      // controlled control receives it in the browser; an uncontrolled one
      // keeps the user's edits and gets its initial value as the default.
      if (local.as === 'textarea') {
        const other = omit(native, ['value']);
        return isServer || !controlled
          ? { ...other, children: String(value) }
          : { ...other, value, children: String(value) };
      }
      if (isServer) return { ...native, value };
      // Solid 2 removed `attr:`; `defaultValue` sets the input's value attribute.
      return controlled
        ? { ...native, value, defaultValue: value }
        : { ...omit(native, ['value']), defaultValue: value };
    },
  );

  /** Merge the primitive Field state with native appearance attributes. */
  function renderInput(
    getProps: Parameters<NonNullable<FieldInputProps['asChild']>>[0],
  ): JSX.Element {
    const attributes = createMemo(
      /** Follow Field state, native values, and finite appearance selections. */
      () => {
        const field = getProps(nativeProps() as JSX.IntrinsicElements['input']);
        return {
          ...field,
          ...inputAppearanceAttributes(local.size, local.variant, 'Input'),
          class: composeRecipeClassNames('input', undefined, local.class, local.className),
          'data-leverui-color-palette': local.colorPalette,
          'data-unstyled': local.unstyled ? '' : undefined,
          ref: local.ref,
        };
      },
    );
    return (
      <>
        {local.asChild ? (
          renderNativeLayoutChild('Input', local.asChild, attributes, () => nativeProps().children)
        ) : (
          <NativeElement component={local.as ?? 'input'} {...attributes()} />
        )}
      </>
    );
  }

  return <PrimitiveField.Input asChild={renderInput} />;
}

export type { InputProps } from './input-props';

/** Render a native Solid control with the primitive Field and authored CSS. */
export const Input = InputRoot as <As extends NativeElementTag = 'input'>(
  props: InputProps<As>,
) => JSX.Element;
