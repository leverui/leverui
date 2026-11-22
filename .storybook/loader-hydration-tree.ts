import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Loader as LoaderExport, LoaderOverlay as LoaderOverlayExport } from '../src';

type LoaderHydrationComponents = {
  Loader: typeof LoaderExport;
  LoaderOverlay: typeof LoaderOverlayExport;
};

/** Build matching Loader and overlay trees on server and browser. */
export function renderLoaderHydrationTree({
  Loader,
  LoaderOverlay,
}: LoaderHydrationComponents): JSX.Element {
  const [visible, setVisible] = createSignal(true);

  /** Switch Loader between its wrapped and bypassed branches. */
  function toggleVisible(): void {
    setVisible(!visible());
  }

  return [
    createComponent(Dynamic, {
      component: 'div',
      id: 'loader-hydration-host',
      style: { position: 'relative', width: '200px', height: '100px' },
      /** Keep both components in matching server and browser order. */
      get children() {
        return [
          createComponent(Loader, {
            id: 'hydrated-loader',
            text: 'Working',
            /** Follow the current visibility signal. */
            get visible() {
              return visible();
            },
            children: 'Ready',
          }),
          createComponent(LoaderOverlay, {
            id: 'hydrated-loader-overlay',
            children: 'Overlay',
          }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'loader-hydration-toggle',
      type: 'button',
      onClick: toggleVisible,
      children: 'Toggle',
    }),
  ];
}
