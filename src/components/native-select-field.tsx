import { splitProps } from '../primitives/utils/split-props';
import { Field as PrimitiveField, type FieldSelectProps } from '../primitives/components/field';
import { createMemo, onSettled, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, isServer } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { omit } from '../utils/omit';
import { applyNativeSelectDefault } from './native-select-default-value';
import type { NativeElementTag } from './native-element-props';
import type { NativeSelectFieldBaseProps, NativeSelectFieldProps } from './native-select-props';
import { selectedServerOptions } from './native-select-server-options';
import { useNativeSelectState } from './native-select-state';

type RuntimeProps = Omit<
  JSX.IntrinsicElements['select'],
  keyof NativeSelectFieldBaseProps | 'ref'
> &
  NativeSelectFieldBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected native control without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Keep the primitive Field semantics and native selection under authored CSS. */
function NativeSelectFieldImpl(props: RuntimeProps): JSX.Element {
  const state = useNativeSelectState();
  const [local, rest] = splitProps(props, [
    'placeholder',
    'defaultValue',
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const initialDefaultValue = untrack(
    /** Keep an uncontrolled default stable while other props change. */
    () => local.defaultValue,
  );
  const nativeProps = createMemo(
    /** Omit controlled values from server select markup. */
    () => (isServer ? omit(rest, ['value']) : rest),
  );
  let selectElement: HTMLSelectElement | undefined;

  /** Retain the native select for reset behavior and forward its ref. */
  function attachSelect(element: Element): void {
    if (element instanceof HTMLSelectElement) selectElement = element;
    untrack(() => local.ref)?.(element);
  }

  onSettled(
    /** Initialize uncontrolled selection after native options enter the DOM. */
    () => {
      if (!selectElement || rest.value !== undefined || initialDefaultValue === undefined) return;
      applyNativeSelectDefault(selectElement, initialDefaultValue);
    },
  );

  /** Preserve caller options and mark server-rendered defaults. */
  function renderOptions(): JSX.Element {
    const options = [
      local.placeholder && <option value="">{local.placeholder}</option>,
      local.children,
    ];
    if (!isServer) return options;
    const value = rest.value === undefined ? initialDefaultValue : rest.value;
    return value === undefined
      ? options
      : selectedServerOptions(options, value, Boolean(rest.multiple));
  }

  /** Merge the primitive Field attributes into one native control. */
  function renderSelect(
    getProps: Parameters<NonNullable<FieldSelectProps['asChild']>>[0],
  ): JSX.Element {
    const attributes = createMemo(
      /** Follow Field state, group offsets, and caller attributes. */
      () => {
        const field = getProps(nativeProps() as JSX.IntrinsicElements['select']);
        return {
          ...field,
          disabled: state.disabled(),
          'data-invalid': state.invalid() ? '' : undefined,
          'data-unstyled': local.unstyled ? '' : undefined,
          class: composeRecipeClassNames(
            'native-select__field',
            undefined,
            local.class,
            local.className,
          ),
          ref: attachSelect,
        };
      },
    );
    return (
      <>
        {local.asChild ? (
          renderNativeLayoutChild('NativeSelectField', local.asChild, attributes, renderOptions)
        ) : (
          <NativeElement component={local.as ?? 'select'} {...attributes()}>
            {renderOptions()}
          </NativeElement>
        )}
      </>
    );
  }

  return <PrimitiveField.Select asChild={renderSelect} />;
}

/** Preserve selected native tag and ref types in the public signature. */
export const NativeSelectField = NativeSelectFieldImpl as <As extends NativeElementTag = 'select'>(
  props: NativeSelectFieldProps<As>,
) => JSX.Element;
