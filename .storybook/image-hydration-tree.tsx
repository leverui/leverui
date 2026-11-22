import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Image as ImageExport } from '../src';

export interface ImageHydrationComponents {
  Image: typeof ImageExport;
}

const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/%3E';

/** Build one Image tree for published SSR and browser hydration. */
export function renderImageHydrationTree(components: ImageHydrationComponents): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Update native size and CSS image positioning after hydration. */
  function toggleImage(): void {
    setChanged(!changed());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve child order across the server and browser renders. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-image-toggle',
          onClick: toggleImage,
          children: 'Change image',
        }),
        createComponent(components.Image, {
          id: 'hydrated-image',
          src: imageSource,
          alt: 'Hydrated image',
          /** Update the alias without replacing the image element. */
          get fit() {
            return changed() ? ('contain' as const) : ('cover' as const);
          },
          /** Change the CSS alignment through the Image alias. */
          get align() {
            return changed() ? ('right bottom' as const) : ('left top' as const);
          },
          /** Keep the native width attribute reactive. */
          get htmlWidth() {
            return changed() ? 250 : 200;
          },
          /** Keep native CSS width reactive alongside the attribute. */
          get style() {
            return { width: changed() ? '130px' : '90px' };
          },
        }),
      ];
    },
  });
}
