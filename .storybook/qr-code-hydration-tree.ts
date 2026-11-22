import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  QrCodeDownloadTrigger as DownloadExport,
  QrCodeFrame as FrameExport,
  QrCodeOverlay as OverlayExport,
  QrCodePattern as PatternExport,
  QrCodeRoot as RootExport,
  QrCodeRootProvider as RootProviderExport,
  useQrCode as UseQrCodeExport,
} from '../src';

export interface QrCodeHydrationComponents {
  QrCodeRoot: typeof RootExport;
  QrCodeRootProvider: typeof RootProviderExport;
  QrCodeFrame: typeof FrameExport;
  QrCodeOverlay: typeof OverlayExport;
  QrCodePattern: typeof PatternExport;
  QrCodeDownloadTrigger: typeof DownloadExport;
  useQrCode: typeof UseQrCodeExport;
}

/** Build matching server and browser QR trees with live machine updates. */
export function renderQrCodeHydrationTree({
  QrCodeRoot,
  QrCodeRootProvider,
  QrCodeFrame,
  QrCodeOverlay,
  QrCodePattern,
  QrCodeDownloadTrigger,
  useQrCode,
}: QrCodeHydrationComponents): JSX.Element {
  const [value, setValue] = createSignal('Hydrated QR');
  const external = useQrCode({
    defaultValue: 'External hydrated QR',
    ids: { root: 'hydrated-qr-external', frame: 'hydrated-qr-external-frame' },
  });

  /** Change the controlled QR after hydration. */
  function changeValue(): void {
    setValue('Updated hydrated QR');
  }

  /** Change the external QR store after hydration. */
  function changeExternal(): void {
    external().setValue('Updated external hydrated QR');
  }

  return [
    createComponent(QrCodeRoot, {
      /** Read the controlled value after hydration updates. */
      get value() {
        return value();
      },
      size: 'sm' as const,
      // Zag 2 writes `ids` only on referenced parts, so set the DOM ids explicitly.
      id: 'hydrated-qr-root',
      ids: {
        root: 'hydrated-qr-root',
        frame: 'hydrated-qr-frame',
        overlay: 'hydrated-qr-overlay',
      },
      /** Create the default path, overlay, and download inside the primitive context. */
      get children() {
        return [
          createComponent(QrCodeFrame, {
            id: 'hydrated-qr-frame',
            'aria-label': 'Hydrated QR code',
          }),
          createComponent(QrCodeOverlay, { id: 'hydrated-qr-overlay', children: 'UI' }),
          createComponent(QrCodeDownloadTrigger, {
            fileName: 'hydrated-qr.png',
            mimeType: 'image/png' as const,
            children: 'Download',
          }),
        ];
      },
    }),
    createComponent(QrCodeRootProvider, {
      value: external,
      size: 'xs' as const,
      /** Create an explicitly composed path under the external store. */
      get children() {
        return createComponent(QrCodeFrame, {
          id: 'hydrated-qr-external-frame',
          'aria-label': 'External hydrated QR code',
          /** Keep the path inside the external frame. */
          get children() {
            return createComponent(QrCodePattern, {});
          },
        });
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      id: 'hydrated-qr-update',
      onClick: changeValue,
      children: 'Update QR',
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      id: 'hydrated-qr-external-update',
      onClick: changeExternal,
      children: 'Update external QR',
    }),
  ];
}
