import { type ComponentProps } from '@solidjs/web';
import { For, Show } from 'solid-js';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { primitive } from '../factory';
import { type UseHighlightProps, useHighlight } from './use-highlight';

export type HighlightBaseProps = UseHighlightProps;

export type HighlightProps = Assign<ComponentProps<'mark'>, HighlightBaseProps>;

/** Render the Highlight root. */
export const Highlight = (props: HighlightProps) => {
  if (typeof props.text !== 'string') {
    throw new Error('[leverui/highlight] text must be a string');
  }

  const [highlightProps, localProps] = createSplitProps<HighlightBaseProps>()(props, [
    'query',
    'text',
    'ignoreCase',
    'matchAll',
    'exactMatch',
  ]);

  const chunks = useHighlight(highlightProps);

  return (
    <For each={chunks()}>
      {(chunk) => (
        <Show when={chunk.match} fallback={chunk.text}>
          <primitive.mark {...localProps}>{chunk.text}</primitive.mark>
        </Show>
      )}
    </For>
  );
};
