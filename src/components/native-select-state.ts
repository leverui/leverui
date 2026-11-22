import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface NativeSelectState {
  disabled: Accessor<boolean>;
  invalid: Accessor<boolean>;
}

const NativeSelectContext = createOptionalContext<NativeSelectState>();

/** Scope native field state to the nearest Native Select root. */
export const NativeSelectStateProvider = NativeSelectContext;

/** Read the nearest Native Select root's reactive state. */
export function useNativeSelectState(): NativeSelectState {
  const state = useOptionalContext(NativeSelectContext);
  if (!state) throw new Error('Native Select parts must be inside NativeSelectRoot.');
  return state;
}
