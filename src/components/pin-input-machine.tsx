import {
  usePinInput as usePrimitivePinInput,
  usePinInputContext as usePrimitivePinInputContext,
} from '../primitives/components/pin-input';
import type { Api, Props, ValueChangeDetails, ValueInvalidDetails } from '@zag-js/pin-input';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type UsePinInputProps = Omit<Props, 'dir' | 'getRootNode' | 'id'> & {
  id?: Props['id'];
};
export type UsePinInputReturn = Accessor<Api<PropTypes>>;
export type UsePinInputContext = UsePinInputReturn;
export type PinInputValueChangeDetails = ValueChangeDetails;
export type PinInputValueInvalidDetails = ValueInvalidDetails;

export interface PinInputContextProps {
  children: (context: UsePinInputReturn) => JSX.Element;
}

/** Create a caller-owned Pin Input machine; Zag 2 requires its `count`. */
export function usePinInput(
  props: UsePinInputProps | Accessor<UsePinInputProps>,
): UsePinInputReturn {
  return usePrimitivePinInput(props);
}

/** Read the nearest reactive Pin Input machine. */
export function usePinInputContext(): UsePinInputReturn {
  return usePrimitivePinInputContext();
}

/** Render custom content against the current Pin Input machine. */
export function PinInputContext(props: PinInputContextProps): JSX.Element {
  return <>{props.children(usePinInputContext())}</>;
}
