import { type Accessor, createEffect, createMemo, createSignal, createUniqueId } from 'solid-js';
import { mergeProps } from '../../utils/merge-props';
import { useEnvironmentContext } from '../../providers/index';
import { ariaAttr, dataAttr } from '../../utils/attr';
import type { MaybeAccessor } from '../../types';
import { useFieldsetContext } from '../fieldset/index';
import type { UseFieldsetReturn } from '../fieldset/use-fieldset';
import { parts } from './field.anatomy';
import type { UseFieldProps } from './use-field-types';
export type { ElementIds, UseFieldProps } from './use-field-types';

export type UseFieldReturn = Accessor<ReturnType<ReturnType<typeof useField>>>;

/** Create the field state and return its API. */
export const useField = (props?: MaybeAccessor<UseFieldProps>) => {
  const fieldset: UseFieldsetReturn | undefined = useFieldsetContext();
  const env = useEnvironmentContext();

  const fieldProps = mergeProps(
    { disabled: Boolean(fieldset?.().disabled), required: false, invalid: false, readOnly: false },
    props,
  );

  const [hasErrorText, setHasErrorText] = createSignal(false);
  const [hasHelperText, setHasHelperText] = createSignal(false);

  const id = fieldProps.id ?? createUniqueId();
  const [rootRef, setRootRef] = createSignal<HTMLDivElement | undefined>(undefined);

  const rootId = fieldProps.ids?.root ?? `field::${id}`;
  const controlId = fieldProps.ids?.control ?? id;
  const errorTextId = fieldProps.ids?.errorText ?? `field::${id}::error-text`;
  const helperTextId = fieldProps.ids?.helperText ?? `field::${id}::helper-text`;
  const labelId = fieldProps.ids?.label ?? `field::${id}::label`;

  // Follow the root element instead of reading it once when the field settles:
  // during hydration the root's ref can arrive after that point.
  createEffect(
    () => rootRef(),
    (rootNode) => {
      if (!rootNode) return;

      /** Check text elements. */
      const checkTextElements = () => {
        const docOrShadowRoot = env().getRootNode() as ShadowRoot | Document;
        setHasErrorText(!!docOrShadowRoot.getElementById(errorTextId));
        setHasHelperText(!!docOrShadowRoot.getElementById(helperTextId));
      };

      checkTextElements();

      const win = env().getWindow();
      const observer = new win.MutationObserver(checkTextElements);
      observer.observe(rootNode, { childList: true, subtree: true });

      return () => observer.disconnect();
    },
  );

  /** Get the root props. */
  const getRootProps = () => ({
    ...parts.root.attrs(id),
    id: rootId,
    role: 'group',
    'data-disabled': dataAttr(fieldProps.disabled),
    'data-invalid': dataAttr(fieldProps.invalid),
    'data-readonly': dataAttr(fieldProps.readOnly),
  });

  const targetControlId = fieldProps.target
    ? `field::${controlId}::item::${fieldProps.target}`
    : undefined;

  /** Get the label props. */
  const getLabelProps = () => ({
    ...parts.label.attrs(id),
    id: labelId,
    'data-disabled': dataAttr(fieldProps.disabled),
    'data-invalid': dataAttr(fieldProps.invalid),
    'data-readonly': dataAttr(fieldProps.readOnly),
    'data-required': dataAttr(fieldProps.required),
    for: targetControlId ?? controlId,
  });

  const errorMessageId = createMemo(() =>
    hasErrorText() && fieldProps.invalid ? errorTextId : undefined,
  );
  const describedById = createMemo(
    () =>
      [errorMessageId(), hasHelperText() ? helperTextId : undefined].filter(Boolean).join(' ') ||
      undefined,
  );

  /** Get the control props. */
  const getControlProps = () => ({
    'aria-describedby': describedById(),
    'aria-invalid': ariaAttr(fieldProps.invalid),
    'data-invalid': dataAttr(fieldProps.invalid),
    'data-required': dataAttr(fieldProps.required),
    'data-readonly': dataAttr(fieldProps.readOnly),
    id: controlId,
    required: fieldProps.required,
    disabled: fieldProps.disabled,
    readonly: fieldProps.readOnly || undefined,
  });

  /** Get the input props. */
  const getInputProps = () => ({
    ...getControlProps(),
    ...parts.input.attrs(id),
  });

  /** Get the textarea props. */
  const getTextareaProps = () => ({
    ...getControlProps(),
    ...parts.textarea.attrs(id),
  });

  /** Get the select props. */
  const getSelectProps = () => ({
    ...getControlProps(),
    ...parts.select.attrs(id),
  });

  /** Get the helper text props. */
  const getHelperTextProps = () => ({
    id: helperTextId,
    ...parts.helperText.attrs(id),
    'data-disabled': dataAttr(fieldProps.disabled),
  });

  /** Get the error text props. */
  const getErrorTextProps = () => ({
    id: errorTextId,
    ...parts.errorText.attrs(id),
    'aria-live': 'polite',
  });

  /** Get the required indicator props. */
  const getRequiredIndicatorProps = () => ({
    'aria-hidden': 'true' as const,
    ...parts.requiredIndicator.attrs(id),
  });

  return createMemo(() => ({
    ariaDescribedby: describedById(),
    ids: {
      root: rootId,
      control: controlId,
      label: labelId,
      errorText: errorTextId,
      helperText: helperTextId,
    },
    refs: {
      rootRef: setRootRef,
    },
    disabled: fieldProps.disabled,
    invalid: fieldProps.invalid,
    readOnly: fieldProps.readOnly,
    required: fieldProps.required,
    getLabelProps,
    getRootProps,
    getInputProps,
    getTextareaProps,
    getSelectProps,
    getHelperTextProps,
    getErrorTextProps,
    getRequiredIndicatorProps,
  }));
};
