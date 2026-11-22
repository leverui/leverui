import { type JSX } from '@solidjs/web';
import { type UsePinInputContext, usePinInputContext } from './use-pin-input-context';

export interface PinInputContextProps {
  children: (context: UsePinInputContext) => JSX.Element;
}

/** Render the PinInput context context through a function child. */
export const PinInputContext = (props: PinInputContextProps) =>
  props.children(usePinInputContext());
