import {
  Field as PrimitiveField,
  useField as usePrimitiveField,
  useFieldContext as usePrimitiveFieldContext,
} from '../primitives/components/field';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  FieldContextProps,
  UseFieldContext,
  UseFieldProps,
  UseFieldReturn,
} from './field-contract';
import type { FieldItemProps } from './field-props';

export type {
  FieldContextProps,
  UseFieldContext,
  UseFieldProps,
  UseFieldReturn,
} from './field-contract';

/** Create a reactive primitive Field accessor for an externally owned root. */
export function useField(props?: UseFieldProps | Accessor<UseFieldProps>): UseFieldReturn {
  return usePrimitiveField(props);
}

/** Read the nearest primitive Field context without changing its state. */
export function useFieldContext(): UseFieldContext {
  return usePrimitiveFieldContext();
}

/** Render the current Field context through the caller's function. */
export function FieldContext(props: FieldContextProps): JSX.Element {
  return createComponent(PrimitiveField.Context, props);
}

/** Scope a Field label and control pair to a selected item value. */
export function FieldItem(props: FieldItemProps): JSX.Element {
  return createComponent(PrimitiveField.Item, props);
}
