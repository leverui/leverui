import { createEffect, createMemo, createSignal, createUniqueId } from 'solid-js';
import { mergeProps } from '../../utils/merge-props';
import { useEnvironmentContext } from '../../providers/index';
import { dataAttr } from '../../utils/attr';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { parts } from './fieldset.anatomy';

export interface UseFieldsetProps {
  /**
   * The id of the fieldset.
   */
  id?: string;
  /**
   * Indicates whether the fieldset is disabled.
   */
  disabled?: boolean;
  /**
   * Indicates whether the fieldset is invalid.
   */
  invalid?: boolean;
}

export type UseFieldsetReturn = ReturnType<typeof useFieldset>;

/** Create the fieldset state and return its API. */
export const useFieldset = (props?: MaybeAccessor<UseFieldsetProps>) => {
  const env = useEnvironmentContext();

  const mergedProps = mergeProps({ disabled: false, invalid: false }, runIfFn(props));

  const [rootRef, setRootRef] = createSignal<HTMLFieldSetElement | undefined>(undefined);
  const id = mergedProps.id ?? createUniqueId();

  const legendId = `fieldset::${id}::legend`;
  const errorTextId = `fieldset::${id}::error-text`;
  const helperTextId = `fieldset::${id}::helper-text`;

  const [hasErrorText, setHasErrorText] = createSignal(false);
  const [hasHelperText, setHasHelperText] = createSignal(false);

  // Follow the root element instead of reading it once when the fieldset
  // settles: during hydration the root's ref can arrive after that point.
  createEffect(
    () => rootRef(),
    (rootNode) => {
      if (!rootNode) return;

      /** Check text elements. */
      const checkTextElements = () => {
        const docOrShadowRoot = env().getRootNode() as DocumentFragment;
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

  const labelIds = createMemo(() => {
    const ids: string[] = [];
    if (hasErrorText() && mergedProps.invalid) ids.push(errorTextId);
    if (hasHelperText()) ids.push(helperTextId);
    return ids;
  });

  /** Get the root props. */
  const getRootProps = () => ({
    ...parts.root.attrs(id),
    disabled: mergedProps.disabled,
    'data-disabled': dataAttr(mergedProps.disabled),
    'data-invalid': dataAttr(mergedProps.invalid),
    'aria-labelledby': legendId,
    'aria-describedby': labelIds().join(' ') || undefined,
  });

  /** Get the legend props. */
  const getLegendProps = () => ({
    id: legendId,
    ...parts.legend.attrs(id),
    'data-disabled': dataAttr(mergedProps.disabled),
    'data-invalid': dataAttr(mergedProps.invalid),
  });

  /** Get the helper text props. */
  const getHelperTextProps = () => ({
    id: helperTextId,
    ...parts.helperText.attrs(id),
  });

  /** Get the error text props. */
  const getErrorTextProps = () => ({
    id: errorTextId,
    ...parts.errorText.attrs(id),
    'aria-live': 'polite',
  });

  return createMemo(() => ({
    refs: {
      rootRef: setRootRef,
    },
    ids: {
      legend: legendId,
      errorText: errorTextId,
      helperText: helperTextId,
    },
    disabled: mergedProps.disabled,
    invalid: mergedProps.invalid,
    getRootProps,
    getLegendProps,
    getHelperTextProps,
    getErrorTextProps,
  }));
};
