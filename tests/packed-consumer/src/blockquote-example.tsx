import { Blockquote, BlockquotePropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise published Blockquote parts and changing provider defaults. */
export function PackedBlockquote(): JSX.Element {
  const [centered, setCentered] = createSignal(false);

  /** Change inherited alignment without replacing the figure. */
  function toggleAlignment(): void {
    setCentered(!centered());
  }

  return (
    <>
      <BlockquotePropsProvider value={{ justify: centered() ? 'center' : 'start' }}>
        <Blockquote.Root id="packed-blockquote" variant="solid" colorPalette="blue">
          <Blockquote.Icon />
          <Blockquote.Content cite="https://example.com">Installed quote</Blockquote.Content>
          <Blockquote.Caption>
            <cite>Installed author</cite>
          </Blockquote.Caption>
        </Blockquote.Root>
      </BlockquotePropsProvider>
      <button id="packed-blockquote-toggle" type="button" onClick={toggleAlignment}>
        Change quote alignment
      </button>
    </>
  );
}
