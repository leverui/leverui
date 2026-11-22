import { QrCode, type QrCodeRootProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

const rootProps: Pick<QrCodeRootProps, 'size' | 'encoding'> = {
  size: 'sm',
  encoding: { ecc: 'H' },
};

/** Exercise the installed QR declarations and reactive SVG output. */
export function PackedQrCode(): JSX.Element {
  const [value, setValue] = createSignal('Packed QR');

  /** Change the packaged QR machine's controlled payload. */
  function updateValue(): void {
    setValue('Updated packed QR');
  }

  /** Confirm selected button events retain the native current target type. */
  function markOverlayClick(event: MouseEvent & { currentTarget: HTMLButtonElement }): void {
    event.currentTarget.setAttribute('data-packed-button-clicked', 'true');
  }

  return (
    <section class="packed-qr-css">
      <QrCode.Root
        {...rootProps}
        as="section"
        ref={
          /** Prove the selected native root reaches consumer refs. */
          (element: HTMLElement) =>
            element.setAttribute('data-packed-qr-ref', element.tagName.toLowerCase())
        }
        value={value()}
        id="packed-qr"
      >
        <QrCode.Frame
          aria-label="Packed QR code"
          htmlWidth={96}
          htmlHeight={96}
          ref={
            /** Keep the frame's native SVG ref type through the public API. */
            (element: SVGSVGElement) => element.setAttribute('data-packed-svg-ref', 'true')
          }
        />
        <QrCode.Overlay
          as="button"
          type="button"
          disabled={false}
          onClick={markOverlayClick}
          ref={
            /** Accept button-specific attributes and refs on a selected overlay. */
            (element: HTMLButtonElement) => element.setAttribute('data-packed-button-ref', 'true')
          }
          data-testid="packed-qr-button-overlay"
        >
          UI
        </QrCode.Overlay>
        <QrCode.DownloadTrigger fileName="packed-qr.png" mimeType="image/png">
          Download
        </QrCode.DownloadTrigger>
      </QrCode.Root>
      <button type="button" id="packed-qr-update" onClick={updateValue}>
        Update QR
      </button>
    </section>
  );
}
