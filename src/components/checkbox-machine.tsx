import {
  useCheckbox as usePrimitiveCheckbox,
  useCheckboxContext as usePrimitiveCheckboxContext,
  useCheckboxGroup as usePrimitiveCheckboxGroup,
  useCheckboxGroupContext as usePrimitiveCheckboxGroupContext,
} from '../primitives/components/checkbox';
import type { Api, Props } from '@zag-js/checkbox';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { UseCheckboxGroupProps, UseCheckboxGroupReturn } from './checkbox-group-machine-types';

export type UseCheckboxProps = Omit<Props, 'dir' | 'getRootNode' | 'id'> & {
  id?: Props['id'];
};
export type UseCheckboxReturn = Accessor<Api<PropTypes>>;
export type { UseCheckboxGroupProps, UseCheckboxGroupReturn } from './checkbox-group-machine-types';

export interface CheckboxContextProps {
  children: (context: UseCheckboxReturn) => JSX.Element;
}

/** Create a caller-owned Checkbox machine under the current Solid owner. */
export function useCheckbox(
  props?: UseCheckboxProps | Accessor<UseCheckboxProps>,
): UseCheckboxReturn {
  return usePrimitiveCheckbox(props);
}

/** Read the nearest reactive Checkbox machine. */
export function useCheckboxContext(): UseCheckboxReturn {
  return usePrimitiveCheckboxContext();
}

/** Render custom content from the current Checkbox machine. */
export function CheckboxContext(props: CheckboxContextProps): JSX.Element {
  return <>{props.children(useCheckboxContext())}</>;
}

/** Create a caller-owned group for a composed set of checkboxes. */
export function useCheckboxGroup(props?: UseCheckboxGroupProps): UseCheckboxGroupReturn {
  return usePrimitiveCheckboxGroup(props);
}

/** Read the nearest Checkbox Group's reactive selection state. */
export function useCheckboxGroupContext(): UseCheckboxGroupReturn | undefined {
  return usePrimitiveCheckboxGroupContext();
}
