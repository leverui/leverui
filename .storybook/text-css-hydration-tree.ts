import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Text as TextExport, TextProps } from '../src';

export interface TextCssHydrationComponents {
  Text: typeof TextExport;
}

/** Render the same reactive clipping tree on server and browser. */
export function renderTextCssHydrationTree({ Text }: TextCssHydrationComponents): JSX.Element {
  const [active, setActive] = createSignal(true);

  /** Switch both clipping choices without replacing the native paragraphs. */
  function toggleClipping(): void {
    setActive(!active());
  }

  return [
    createComponent(Text, {
      id: 'hydrated-css-truncate',
      /** Keep the clipping prop reactive without recreating the Text child. */
      get truncate() {
        return active();
      },
      /** Update native typography alongside the clipping choice. */
      get style() {
        return { 'font-weight': active() ? 'normal' : 'bold' };
      },
      children: 'Truncation changes after hydration',
    } satisfies TextProps<'p'>),
    createComponent(Text, {
      id: 'hydrated-css-clamp',
      /** Update only this attribute and its authored CSS variable. */
      get lineClamp() {
        return active() ? '2' : 'none';
      },
      children: 'Line clamp changes after hydration',
    } satisfies TextProps<'p'>),
    createComponent(Dynamic, {
      component: 'button',
      id: 'text-css-hydration-toggle',
      type: 'button',
      onClick: toggleClipping,
      children: 'Toggle clipping',
    }),
  ];
}
