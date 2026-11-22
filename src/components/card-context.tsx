import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

const CardContext = createOptionalContext<Accessor<boolean>>();

/** Scope inherited unstyled state to the nearest Card root. */
export const CardContextProvider = CardContext;

/** Read the nearest Card root's unstyled selection. */
export function useCardUnstyled(): Accessor<boolean> {
  const unstyled = useOptionalContext(CardContext);
  if (!unstyled) throw new Error('Card parts must be inside CardRoot.');
  return unstyled;
}
