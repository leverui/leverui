import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { ColorSwatch as SwatchExport, ColorSwatchMix as MixExport } from '../dist/index.js';

export interface ColorSwatchHydrationComponents {
  ColorSwatch: typeof SwatchExport;
  ColorSwatchMix: typeof MixExport;
}

const initialSize = { base: 'xs', md: 'lg' } as const;
const alternateSize = { base: 'sm', md: 'xl' } as const;
const initialShape = { base: 'square', md: 'circle' } as const;
const alternateShape = { base: 'circle', md: 'square' } as const;

/** Build matching reactive swatches for server rendering and hydration. */
export function renderColorSwatchHydrationTree({
  ColorSwatch,
  ColorSwatchMix,
}: ColorSwatchHydrationComponents): JSX.Element {
  const [alternate, setAlternate] = createSignal(false);

  /** Change the color, size, and mixed collection after hydration. */
  function toggleSwatches(): void {
    setAlternate(!alternate());
  }

  return [
    createComponent(ColorSwatch, {
      id: 'hydrated-swatch',
      /** Keep the swatch color bound to the shared signal. */
      get value() {
        return alternate() ? 'blue' : 'red';
      },
      /** Keep responsive size values bound to the shared signal. */
      get size() {
        return alternate() ? alternateSize : initialSize;
      },
      /** Keep responsive shape values bound to the shared signal. */
      get shape() {
        return alternate() ? alternateShape : initialShape;
      },
    }),
    createComponent(ColorSwatchMix, {
      id: 'hydrated-swatch-mix',
      /** Mirror the outer swatch's responsive size. */
      get size() {
        return alternate() ? alternateSize : initialSize;
      },
      /** Mirror the outer swatch's responsive shape. */
      get shape() {
        return alternate() ? alternateShape : initialShape;
      },
      /** Recompute mixed cells without replacing the outer swatch. */
      get items() {
        return alternate() ? ['red', 'green', 'blue'] : ['red', 'blue'];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'swatch-hydration-toggle',
      type: 'button',
      onClick: toggleSwatches,
      children: 'Change swatches',
    }),
  ];
}
