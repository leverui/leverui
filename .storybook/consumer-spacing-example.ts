import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Box } from '../src';

type ConsumerSpacingParts = { Box: typeof Box };

/** Render a consumer CSS spacing choice through SSR and hydration. */
export function renderConsumerSpacingExample(parts: ConsumerSpacingParts): JSX.Element {
  const [spacing, setSpacing] = createSignal<'compact' | 'roomy'>('compact');

  /** Change the CSS spacing choice after browser hydration. */
  function toggleSpacing(): void {
    setSpacing(spacing() === 'compact' ? 'roomy' : 'compact');
  }

  return [
    createComponent(parts.Box, {
      id: 'consumer-spacing-box',
      /** Change the consumer class without replacing the native Box. */
      get class() {
        return spacing() === 'compact' ? 'consumer-spacing-compact' : 'consumer-spacing-roomy';
      },
      children: 'Consumer spacing',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'consumer-spacing-toggle',
      type: 'button',
      onClick: toggleSpacing,
      children: 'Toggle spacing',
    }),
  ];
}
