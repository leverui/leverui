import { ColorSwatch, ColorSwatchMix, ColorSwatchPropsProvider } from '@leverui/components';
import type { ColorSwatchMixProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type MixChildProps = Parameters<NonNullable<ColorSwatchMixProps['asChild']>>[0];

/** Place mixed swatch props on a consumer-owned native element. */
function renderMixChild(getProps: MixChildProps): JSX.Element {
  return <strong {...getProps()} id="packed-swatch-child" />;
}

/** Exercise published swatches and reactive defaults in an installed app. */
export function PackedColorSwatch(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change a mounted swatch's inherited size. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <ColorSwatch value="rgba(255, 0, 0, 0.5)" id="packed-swatch-alpha" />
      <ColorSwatchPropsProvider value={{ size: large() ? 'lg' : 'xs' }}>
        <ColorSwatch value="blue" id="packed-swatch-inherited" />
        <ColorSwatch value="green" size="sm" id="packed-swatch-fixed" />
      </ColorSwatchPropsProvider>
      <ColorSwatchMix items={['red', 'green', 'blue']} as="div" id="packed-swatch-mix" />
      <ColorSwatchMix items={['red', 'blue']} asChild={renderMixChild} />
      <button id="packed-swatch-toggle" type="button" onClick={toggleSize}>
        Change swatch size
      </button>
    </>
  );
}
