import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AbsoluteCenter, Box, Flex, QrCode, Spinner, Stack } from '../../src';
import { QrCodeLogo } from './qr-code-logo';
import './qr-code-examples.css';

const value = 'https://www.google.com';

/** Render the default QR pattern. */
export function QrCodeBasic(): JSX.Element {
  return (
    <QrCode.Root value={value}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  );
}

/** Compare the violet and red pattern fills. */
export function QrCodeWithFill(): JSX.Element {
  return (
    <Flex class="example-qr-code-row">
      <For each={['#5417D7', '#FF0000']}>
        {
          /** Render one colored code with the shared URL. */
          (fill) => (
            <QrCode.Root value={value}>
              <QrCode.Frame style={{ fill }}>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
          )
        }
      </For>
    </Flex>
  );
}

/** Place the logo over the centered QR pattern. */
export function QrCodeWithOverlay(): JSX.Element {
  return (
    <QrCode.Root value={value}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <QrCodeLogo />
      </QrCode.Overlay>
    </QrCode.Root>
  );
}

/** Show all seven sizes in vertical order. */
export function QrCodeWithSizes(): JSX.Element {
  return (
    <Stack>
      <For each={['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const}>
        {
          /** Render one encoded value at its CSS size. */
          (size) => (
            <QrCode.Root size={size} value={value}>
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Center the red loading spinner over the QR pattern. */
export function QrCodeWithSpinner(): JSX.Element {
  return (
    <Box style={{ position: 'relative' }}>
      <QrCode.Root value={value}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
        <AbsoluteCenter class="example-qr-code-loading">
          <Spinner class="example-qr-code-spinner" />
        </AbsoluteCenter>
      </QrCode.Root>
    </Box>
  );
}
