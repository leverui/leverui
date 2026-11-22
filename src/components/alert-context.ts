import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface AlertContextValue {
  status: Accessor<unknown>;
}

const AlertContext = createOptionalContext<AlertContextValue>();

/** Scope native parts and the default indicator to their nearest Alert root. */
export const AlertContextProvider = AlertContext;

/** Read the nearest Alert root's reactive status. */
export function useAlertContext(): AlertContextValue {
  const state = useOptionalContext(AlertContext);
  if (!state) throw new Error('Alert parts must be inside AlertRoot.');
  return state;
}
