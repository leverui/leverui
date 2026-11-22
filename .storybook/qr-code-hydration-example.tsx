import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  QrCodeDownloadTrigger,
  QrCodeFrame,
  QrCodeOverlay,
  QrCodePattern,
  QrCodeRoot,
  QrCodeRootProvider,
  useQrCode,
} from '../src';
import { renderQrCodeHydrationTree } from './qr-code-hydration-tree';

/** Attach browser QR behavior to the published server nodes. */
export function hydrateQrCodeExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to the existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Build the client half of the shared QR tree. */
  function renderExample(): JSX.Element {
    const tree = renderQrCodeHydrationTree({
      QrCodeRoot,
      QrCodeRootProvider,
      QrCodeFrame,
      QrCodeOverlay,
      QrCodePattern,
      QrCodeDownloadTrigger,
      useQrCode,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
