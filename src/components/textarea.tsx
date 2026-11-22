import { splitProps } from '../primitives/utils/split-props';
import { Field as PrimitiveField, type FieldTextareaProps } from '../primitives/components/field';
import { createMemo, createSignal, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, isServer } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { omit } from '../utils/omit';
import { textareaAttributes } from './textarea-attributes';
import { useTextareaAutoresize } from './textarea-autoresize';
import { readTextareaChoices, readTextareaPalette } from './textarea-choices';
import { useTextareaProps, type TextareaProps, type TextareaRootProps } from './textarea-props';

type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a selected native element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Omit the primitive's empty resize declaration when no native style is present. */
function hasNativeStyle(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (!value || typeof value !== 'object') return false;
  return Object.values(value).some(
    /** Keep only declarations with a concrete CSS value. */
    (declaration) => declaration !== undefined && declaration !== null,
  );
}

/** Render the primitive Field's textarea semantics with authored CSS attributes. */
function TextareaRoot(props: TextareaRootProps): JSX.Element {
  const merged = useTextareaProps(props);
  const [local, rest] = splitProps(merged, [
    'as',
    'asChild',
    'autoresize',
    'defaultValue',
    'ref',
    'class',
    'className',
    'style',
    'unstyled',
    'size',
    'variant',
    'colorPalette',
    'children',
  ]);
  const initialDefaultValue = untrack(
    /** Keep the uncontrolled initial value stable as other props update. */
    () => local.defaultValue,
  );
  // A caller-rendered child may run this ref during render, so allow that write.
  const [control, setControl] = createSignal<HTMLElement | undefined>(undefined, {
    ownedWrite: true,
  });
  const choices = createMemo(
    /** Validate finite selections before forwarding native attributes. */
    () => readTextareaChoices(local.size, local.variant),
  );
  const nativeProps = createMemo(
    /** Render the initial native value as content for server hydration. */
    () => {
      const controlled = rest.value !== undefined;
      const value = controlled ? rest.value : initialDefaultValue;
      const native = {
        ...rest,
        ...(local.style === undefined ? {} : { style: local.style }),
      };
      if (value === undefined) return native;
      // Solid 2 reasserts `value` whenever these props update, so only a
      // controlled control receives it in the browser; an uncontrolled one
      // keeps the user's edits and gets its initial value as the default.
      if (local.as && local.as !== 'textarea') {
        if (isServer) return { ...native, value };
        // Solid 2 removed `attr:`; `defaultValue` sets the input's value attribute.
        return controlled
          ? { ...native, value, defaultValue: value }
          : { ...omit(native, ['value']), defaultValue: value };
      }
      const other = omit(native, ['value']);
      return isServer || !controlled
        ? { ...other, children: String(value) }
        : { ...other, value, children: String(value) };
    },
  );

  /** Retain Zag's native control and forward the consumer's selected ref. */
  function attachControl(element: Element): void {
    if (element instanceof HTMLElement) setControl(element);
    untrack(() => local.ref)?.(element);
  }

  /** Follow the automatic sizing option without remounting the element. */
  function isAutoresizeEnabled(): boolean | undefined {
    return local.autoresize;
  }

  /** Read only caller-owned native sizing for Zag cleanup. */
  function readConsumerStyle(): unknown {
    return local.style;
  }

  useTextareaAutoresize(control, isAutoresizeEnabled, readConsumerStyle);

  /** Merge the primitive Field attributes into the selected native control. */
  function renderTextarea(
    getProps: Parameters<NonNullable<FieldTextareaProps['asChild']>>[0],
  ): JSX.Element {
    const attributes = createMemo(
      /** Keep Field state, variants, palette, and native values reactive. */
      () => {
        const field = getProps(nativeProps() as JSX.IntrinsicElements['textarea']);
        const fieldAttributes = { ...field };
        if (!hasNativeStyle(fieldAttributes.style)) delete fieldAttributes.style;
        return {
          ...fieldAttributes,
          ...textareaAttributes(choices()),
          class: composeRecipeClassNames('textarea', undefined, local.class, local.className),
          'data-leverui-color-palette': readTextareaPalette(local.colorPalette),
          'data-unstyled': local.unstyled ? '' : undefined,
          'data-autoresize': local.autoresize ? '' : undefined,
          ref: attachControl,
        };
      },
    );
    return (
      <>
        {local.asChild ? (
          renderNativeLayoutChild('Textarea', local.asChild, attributes, () => {
            const native = nativeProps();
            return 'children' in native ? native.children : local.children;
          })
        ) : (
          <NativeElement component={local.as ?? 'textarea'} {...attributes()} />
        )}
      </>
    );
  }

  return <PrimitiveField.Textarea asChild={renderTextarea} />;
}

/** Render a native multiline control with the primitive Field and Zag behavior. */
export const Textarea = TextareaRoot as <As extends IntrinsicElement = 'textarea'>(
  props: TextareaProps<As>,
) => JSX.Element;
