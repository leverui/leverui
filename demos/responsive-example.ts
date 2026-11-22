import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Box, Button } from '../src';

type ResponsiveComponents = {
  Box: typeof Box;
  Button: typeof Button;
};

/** Build one responsive tree for Storybook, server rendering, and hydration. */
export function renderResponsiveExample({ Box, Button }: ResponsiveComponents): JSX.Element {
  const [padding, setPadding] = createSignal<'2' | '4'>('2');
  const [variant, setVariant] = createSignal<'solid' | 'outline'>('solid');

  /** Switch the base spacing token and Button variant together. */
  function toggleStyles(): void {
    setPadding(padding() === '2' ? '4' : '2');
    setVariant(variant() === 'solid' ? 'outline' : 'solid');
  }

  return [
    createComponent(Box, {
      'data-testid': 'responsive-object',
      class: 'responsive-object',
      /** Expose the current finite spacing choice to authored CSS. */
      get 'data-padding'() {
        return padding();
      },
      children: 'Object spacing',
    }),
    createComponent(Box, {
      'data-testid': 'responsive-array',
      class: 'responsive-array',
      children: 'Array spacing',
    }),
    createComponent(Box, {
      'data-testid': 'responsive-range',
      class: 'responsive-range',
      children: 'Range spacing',
    }),
    createComponent(Box, {
      'data-testid': 'responsive-palette',
      class: 'responsive-palette',
      children: 'Responsive palette',
    }),
    createComponent(Box, {
      'data-testid': 'responsive-state',
      /** Expose the live signal for hydration diagnostics. */
      get children() {
        return padding();
      },
    }),
    createComponent(Button, {
      id: 'responsive-size',
      class: 'responsive-size',
      size: { base: 'sm', md: 'lg' } as const,
      /** Recompute the Button variant without replacing the element. */
      get variant() {
        return variant();
      },
      colorPalette: 'blue',
      children: 'Responsive size',
    }),
    createComponent(Button, {
      id: 'scalar-palette',
      colorPalette: 'blue',
      children: 'Blue button',
    }),
    createComponent(Button, {
      id: 'responsive-toggle',
      variant: 'outline' as const,
      onClick: toggleStyles,
      children: 'Toggle styles',
    }),
  ];
}
