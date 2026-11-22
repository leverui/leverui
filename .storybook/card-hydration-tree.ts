import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  CardBody as BodyExport,
  CardRoot as RootExport,
  CardTitle as TitleExport,
} from '../src';

export interface CardHydrationComponents {
  CardRoot: typeof RootExport;
  CardBody: typeof BodyExport;
  CardTitle: typeof TitleExport;
}

/** Build the same reactive Card tree on server and browser. */
export function renderCardHydrationTree({
  CardRoot,
  CardBody,
  CardTitle,
}: CardHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the Card size after hydration. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return [
    createComponent(CardRoot, {
      as: 'div' as const,
      id: 'hydrated-card',
      variant: 'outline' as const,
      /** Follow the current size in a tracked expression. */
      get size() {
        return large() ? 'lg' : 'sm';
      },
      /** Construct parts only after the root context exists. */
      get children() {
        return [
          createComponent(CardTitle, { children: 'A card' }),
          createComponent(CardBody, { children: 'Card details' }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'card-hydration-toggle',
      type: 'button',
      onClick: toggleSize,
      children: 'Toggle size',
    }),
  ];
}
