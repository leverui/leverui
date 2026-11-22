import {
  useFieldset as usePrimitiveFieldset,
  useFieldsetContext as usePrimitiveFieldsetContext,
} from '../primitives/components/fieldset';
import { type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type {
  FieldsetContextProps,
  UseFieldsetContext,
  UseFieldsetProps,
  UseFieldsetReturn,
} from './fieldset-contract';

export type {
  FieldsetContextProps,
  UseFieldsetContext,
  UseFieldsetProps,
  UseFieldsetReturn,
} from './fieldset-contract';

/** Validate Zag's empty-string data attributes at the primitive type boundary. */
function readFieldsetDataAttribute(value: unknown): '' | undefined {
  if (value === '' || value === undefined) return value;
  throw new TypeError('Unexpected Fieldset data attribute value');
}

/** Expose Zag's runtime data-attribute contract without a type assertion. */
function reflectFieldsetDataAttributes(
  accessor: ReturnType<typeof usePrimitiveFieldset>,
): UseFieldsetReturn {
  /** Read the current primitive state and its validated part attributes. */
  function readState(): ReturnType<UseFieldsetReturn> {
    const state = accessor();

    /** Read root attributes with the actual Zag data-attribute values. */
    function getRootProps(): ReturnType<ReturnType<UseFieldsetReturn>['getRootProps']> {
      const props = state.getRootProps();
      return {
        ...props,
        'data-disabled': readFieldsetDataAttribute(props['data-disabled']),
        'data-invalid': readFieldsetDataAttribute(props['data-invalid']),
      };
    }

    /** Read legend attributes with the actual Zag data-attribute values. */
    function getLegendProps(): ReturnType<ReturnType<UseFieldsetReturn>['getLegendProps']> {
      const props = state.getLegendProps();
      return {
        ...props,
        'data-disabled': readFieldsetDataAttribute(props['data-disabled']),
        'data-invalid': readFieldsetDataAttribute(props['data-invalid']),
      };
    }

    return { ...state, getRootProps, getLegendProps };
  }

  return readState;
}

/** Create a reactive primitive Fieldset accessor for an externally owned root. */
export function useFieldset(
  props?: UseFieldsetProps | Accessor<UseFieldsetProps>,
): UseFieldsetReturn {
  const liveProps = mergeProps(
    /** Keep accessor-owned state reactive when the primitive snapshots the input object. */
    () => (typeof props === 'function' ? props() : (props ?? {})),
  );
  return reflectFieldsetDataAttributes(usePrimitiveFieldset(liveProps));
}

/** Read the nearest primitive Fieldset context without changing its state. */
export function useFieldsetContext(): UseFieldsetContext {
  return reflectFieldsetDataAttributes(usePrimitiveFieldsetContext());
}

/** Render the current Fieldset accessor through the caller's function. */
export function FieldsetContext(props: FieldsetContextProps): JSX.Element {
  return <>{props.children(useFieldsetContext())}</>;
}
