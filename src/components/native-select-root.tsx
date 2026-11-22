import { splitProps } from '../primitives/utils/split-props';
import { useFieldContext as usePrimitiveFieldContext } from '../primitives/components/field';
import { createComponent, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { nativeSelectAttributes } from './native-select-appearance';
import {
  useNativeSelectProps,
  type NativeSelectRootProps,
  type NativeSelectRuntimeRootProps,
} from './native-select-props';
import { NativeSelectStateProvider } from './native-select-state';

/** Render a selected native root without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Coordinate the primitive Field state and authored Native Select CSS attributes. */
function NativeSelectRootImpl(props: NativeSelectRuntimeRootProps): JSX.Element {
  const field = usePrimitiveFieldContext();
  const [content, instance] = splitProps(props, ['children']);
  const merged = useNativeSelectProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'asChild',
    'size',
    'variant',
    'colorPalette',
    'disabled',
    'invalid',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const disabled = createMemo(
    /** Give the enclosing Field priority over root-owned disabled state. */
    () => Boolean(field?.().disabled ?? local.disabled),
  );
  const invalid = createMemo(
    /** Keep validation state live when the enclosing Field changes. */
    () => Boolean(field?.().invalid ?? local.invalid),
  );
  const attributes = createMemo(
    /** Keep native attributes, appearance, and state reactive. */
    () => ({
      ...native,
      ...nativeSelectAttributes(local.size, local.variant),
      class: composeRecipeClassNames(
        'native-select__root',
        undefined,
        local.class,
        local.className,
      ),
      'data-leverui-color-palette': local.colorPalette,
      'data-disabled': disabled() ? '' : undefined,
      'data-invalid': invalid() ? '' : undefined,
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: local.ref,
    }),
  );

  /** Resolve caller content only after the root state provider is active. */
  function renderChildren(): JSX.Element {
    return content.children;
  }

  /** Mount one root element while its native attributes update in place. */
  function renderRoot(): JSX.Element {
    return local.asChild ? (
      renderNativeLayoutChild('NativeSelectRoot', local.asChild, attributes, renderChildren)
    ) : (
      <NativeElement component={local.as ?? 'div'} {...attributes()}>
        {content.children}
      </NativeElement>
    );
  }

  return createComponent(NativeSelectStateProvider, {
    value: { disabled, invalid },
    /** Render all parts after the root state context exists. */
    get children() {
      return createComponent(renderRoot, {});
    },
  });
}

/** Bind the selected native root tag to its public ref type. */
export const NativeSelectRoot = NativeSelectRootImpl as <As extends NativeElementTag = 'div'>(
  props: NativeSelectRootProps<As>,
) => JSX.Element;
