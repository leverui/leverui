import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useHighlight, type HighlightChunk } from './highlight-hook';
import { Mark } from './mark';

export interface HighlightProps {
  query: string | string[];
  children: string;
  /** Apply a consumer CSS class to matched Mark elements. */
  markClass?: string | undefined;
  /** Apply Solid's native style attribute to matched Mark elements. */
  markStyle?: JSX.CSSProperties | string | undefined;
  ignoreCase?: boolean | undefined;
  matchAll?: boolean | undefined;
}

/** Highlight matching substrings without adding a wrapper around the text. */
export function Highlight(props: HighlightProps): JSX.Element {
  const chunks = useHighlight(
    /** Validate live text and recompute matches when query options change. */
    () => {
      const text = props.children;
      if (typeof text !== 'string') {
        throw new Error('The children prop of Highlight must be a string');
      }
      return {
        text,
        query: props.query,
        ignoreCase: props.ignoreCase,
        matchAll: props.matchAll,
      };
    },
  );

  /** Render matches as native marks and leave surrounding text unchanged. */
  function renderChunk(chunk: HighlightChunk): JSX.Element {
    return chunk.match ? (
      <Mark class={props.markClass} style={props.markStyle}>
        {chunk.text}
      </Mark>
    ) : (
      chunk.text
    );
  }

  return <For each={chunks()}>{renderChunk}</For>;
}
