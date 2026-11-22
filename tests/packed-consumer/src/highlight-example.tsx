import { Highlight, Mark, MarkPropsProvider, useHighlight } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Mark, Highlight, their provider, and the public hook. */
export function PackedHighlight(): JSX.Element {
  const [query, setQuery] = createSignal('Solid');
  const chunks = useHighlight(
    /** Recompute hook matches from the same live query as Highlight. */
    () => ({ text: 'Solid is fast', query: query() }),
  );

  /** Select another match and provider variant without remounting the text. */
  function changeQuery(): void {
    setQuery('fast');
  }

  return (
    <section id="packed-highlight-example">
      <Mark id="packed-mark" variant="text" title="Standalone mark">
        Standalone
      </Mark>
      <MarkPropsProvider
        value={{
          variant: query() === 'Solid' ? 'solid' : 'text',
          colorPalette: 'blue',
          class: 'provided-mark',
          title: 'Provided match',
        }}
      >
        <p id="packed-highlight">
          <Highlight query={query()} markClass="packed-highlight-red">
            Solid is fast
          </Highlight>
        </p>
      </MarkPropsProvider>
      <MarkPropsProvider
        value={{ as: 'strong', title: 'Shared element', class: 'provided-element' }}
      >
        <Mark id="packed-provider-mark">Inherited element</Mark>
        <Mark as="mark" id="packed-provider-override">
          Local element
        </Mark>
      </MarkPropsProvider>
      <output id="packed-highlight-hook">
        {chunks()
          .map(
            /** Show the matching chunks from the installed public hook. */
            (chunk) => (chunk.match ? `[${chunk.text}]` : chunk.text),
          )
          .join('')}
      </output>
      <button id="packed-highlight-toggle" type="button" onClick={changeQuery}>
        Change match
      </button>
    </section>
  );
}
