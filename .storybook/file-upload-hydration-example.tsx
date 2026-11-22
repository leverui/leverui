import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Field, FileUpload } from '../src';
import { renderFileUploadHydrationTree } from './file-upload-hydration-tree';

/** Attach the published file input markup without remounting the input. */
export function hydrateFileUploadExample(target: HTMLElement): void {
  /** Signal that primitive's client owner has connected. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the public tree within Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderFileUploadHydrationTree({ Field, FileUpload });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
