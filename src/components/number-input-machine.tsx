import {
  useNumberInput as usePrimitiveNumberInput,
  useNumberInputContext as usePrimitiveNumberInputContext,
} from '../primitives/components/number-input';
import type {
  Api,
  FocusChangeDetails,
  Props,
  ValueChangeDetails,
  ValueInvalidDetails,
} from '@zag-js/number-input';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type UseNumberInputProps = Omit<Props, 'dir' | 'getRootNode' | 'id'> & {
  id?: Props['id'];
};
export type UseNumberInputReturn = Accessor<Api<PropTypes>>;
export type UseNumberInputContext = UseNumberInputReturn;
export type NumberInputFocusChangeDetails = FocusChangeDetails;
export type NumberInputValueChangeDetails = ValueChangeDetails;
export type NumberInputValueInvalidDetails = ValueInvalidDetails;

export interface NumberInputContextProps {
  children: (context: UseNumberInputReturn) => JSX.Element;
}

/** Create a caller-owned primitive Number Input machine in the current Solid owner. */
export function useNumberInput(
  props?: UseNumberInputProps | Accessor<UseNumberInputProps>,
): UseNumberInputReturn {
  return usePrimitiveNumberInput(props);
}

/** Read the nearest reactive Number Input machine. */
export function useNumberInputContext(): UseNumberInputReturn {
  return usePrimitiveNumberInputContext();
}

/** Render custom content against the current Number Input machine. */
export function NumberInputContext(props: NumberInputContextProps): JSX.Element {
  return <>{props.children(useNumberInputContext())}</>;
}
