import {
  type HighlightChunk,
  type HighlightWordProps,
  highlightWord,
} from '@zag-js/highlight-word';
import { type Accessor } from 'solid-js';
import { createMemo } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseHighlightProps = HighlightWordProps;

/** Create the highlight state and return its API. */
export const useHighlight = (
  props: MaybeAccessor<UseHighlightProps>,
): Accessor<HighlightChunk[]> => {
  return createMemo(() => highlightWord(runIfFn(props)));
};

export type { HighlightChunk };
