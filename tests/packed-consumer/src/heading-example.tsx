import { Heading, HeadingPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import './heading-example.css';

/** Exercise finite Heading sizes from the installed package. */
export function PackedHeading(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change a provider default without replacing the native heading. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <HeadingPropsProvider value={{ size: { base: 'lg', md: large() ? '4xl' : '2xl' } }}>
      <Heading as="h3" id="packed-heading" class="packed-heading">
        Packed heading
      </Heading>
      <button id="packed-heading-toggle" type="button" onClick={toggleSize}>
        Toggle heading size
      </button>
    </HeadingPropsProvider>
  );
}
