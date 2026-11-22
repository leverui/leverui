import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { QrCodeFrame as FrameExport, QrCodeRoot as RootExport } from '../../src';

type ServerExports = {
  QrCodeRoot: typeof RootExport;
  QrCodeFrame: typeof FrameExport;
};

const serverEntry = '../../dist/server/index.js';
const { QrCodeRoot, QrCodeFrame } = (await import(serverEntry)) as ServerExports;

/** Render the published QR root and default SVG pattern without a provider. */
function renderServerQrCode(): JSX.Element {
  return createComponent(QrCodeRoot, {
    value: 'Server QR',
    size: 'lg' as const,
    /** Create the default pattern inside the primitive's QR context. */
    get children() {
      return createComponent(QrCodeFrame, { 'aria-label': 'Server QR code' });
    },
  });
}

/** Verify encoded SVG and CSS hooks in provider-free server markup. */
function verifiesServerQrCode(): void {
  const markup = renderToString(renderServerQrCode);
  expect(markup).toContain('data-qr-code-');
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('data-qr-code-frame');
  expect(markup).toContain('leverui-qr-code__root');
  expect(markup).toContain('leverui-qr-code__pattern');
  expect(markup).toMatch(/<path[^>]*\sd="/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|recipe|encoding)=/);
}

test('published QR Code renders provider-free encoded SVG', verifiesServerQrCode);
