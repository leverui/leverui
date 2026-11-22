import {
  useHighlight as usePrimitiveHighlight,
  type HighlightChunk,
  type UseHighlightProps,
} from '../primitives/components/highlight';
import { type Accessor } from 'solid-js';

export type { HighlightChunk, UseHighlightProps } from '../primitives/components/highlight';

/** Split text into reactive match and nonmatch chunks with the primitive's Zag matcher. */
export function useHighlight(
  props: UseHighlightProps | Accessor<UseHighlightProps>,
): Accessor<HighlightChunk[]> {
  return usePrimitiveHighlight(props);
}
