import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  AvatarFallback as FallbackExport,
  AvatarImage as ImageExport,
  AvatarRoot as RootExport,
} from '../src';

export interface AvatarHydrationComponents {
  AvatarRoot: typeof RootExport;
  AvatarImage: typeof ImageExport;
  AvatarFallback: typeof FallbackExport;
}

const loadedImage =
  'data:image/svg+xml,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"/>');

/** Build identical server and browser Avatar trees with live image loading. */
export function renderAvatarHydrationTree({
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
}: AvatarHydrationComponents): JSX.Element {
  const [source, setSource] = createSignal<string>();

  /** Load an image through the hydrated Avatar machine. */
  function loadImage(): void {
    setSource(loadedImage);
  }

  return [
    createComponent(AvatarRoot, {
      as: 'div' as const,
      id: 'hydrated-avatar',
      ids: {
        root: 'hydrated-avatar',
        image: 'hydrated-avatar-image',
        fallback: 'hydrated-avatar-fallback',
      },
      size: 'lg' as const,
      /** Create both primitive parts in their shared machine context. */
      get children() {
        return [
          createComponent(AvatarImage, {
            /** Read the image URL after hydration without replacing its node. */
            get src() {
              return source();
            },
            alt: 'Ada Lovelace',
            id: 'hydrated-avatar-image',
          }),
          createComponent(AvatarFallback, {
            // Zag 2 writes `ids` only on referenced parts, so set the DOM id explicitly.
            id: 'hydrated-avatar-fallback',
            name: 'Ada Lovelace',
          }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      onClick: loadImage,
      'data-testid': 'hydrated-avatar-load',
      children: 'Load image',
    }),
  ];
}
