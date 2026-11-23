import { type JSX } from '@solidjs/web';
import { Button, QrCode, Stack } from '../../src';
import { QrCodeLogo } from './qr-code-logo';
import './qr-code-examples.css';

const value = 'https://www.google.com';

/** Render the compact outline download button. */
function renderDownloadButton(
  getProps: Parameters<NonNullable<QrCode.DownloadTriggerProps['asChild']>>[0],
): JSX.Element {
  return (
    <Button {...getProps()} variant="outline" size="xs" class="example-qr-code-download">
      Download
    </Button>
  );
}

/** Export a plain QR pattern as a PNG file. */
export function QrCodeWithExport(): JSX.Element {
  return (
    <QrCode.Root value={value}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.DownloadTrigger
        asChild={renderDownloadButton}
        fileName="qr-code.png"
        mimeType="image/png"
      />
    </QrCode.Root>
  );
}

/** Keep the logo inside the exported SVG frame. */
export function QrCodeWithExportWithLogo(): JSX.Element {
  return (
    <QrCode.Root value={value}>
      <QrCode.Frame>
        <QrCode.Pattern />
        <foreignObject x="0" y="0" width="100%" height="100%">
          <QrCode.Overlay class="example-qr-code-logo">
            <QrCodeLogo fluid />
          </QrCode.Overlay>
        </foreignObject>
      </QrCode.Frame>
      <QrCode.DownloadTrigger
        asChild={renderDownloadButton}
        fileName="qr-code-with-logo.png"
        mimeType="image/png"
      />
    </QrCode.Root>
  );
}

/** Render the Download QR button used by the anatomy explorer. */
function renderExplorerButton(
  getProps: Parameters<NonNullable<QrCode.DownloadTriggerProps['asChild']>>[0],
): JSX.Element {
  return (
    <Button {...getProps()} size="sm" variant="outline" class="example-qr-code-download-wide">
      Download QR
    </Button>
  );
}

/** Show every QR Code part, including a logo overlay, in the anatomy explorer. */
export function QrCodeExplorerDemo(): JSX.Element {
  return (
    <Stack gap="6" align="center" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
      <QrCode.Root value={value}>
        <QrCode.Frame>
          <QrCode.Pattern />
          <foreignObject x="0" y="0" width="100%" height="100%">
            <QrCode.Overlay class="example-qr-code-logo">
              <QrCodeLogo fluid />
            </QrCode.Overlay>
          </foreignObject>
        </QrCode.Frame>
        <QrCode.DownloadTrigger
          asChild={renderExplorerButton}
          fileName="qr-code.png"
          mimeType="image/png"
        />
      </QrCode.Root>
    </Stack>
  );
}
