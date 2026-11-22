import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { QrCode, QrCodeRootProvider, useQrCode } from '../src';

/** Exercise QR encoding, slot styles, external state, and inherited size. */
function QrCodeContractExample(): JSX.Element {
  const [value, setValue] = createSignal('https://leverui.com');
  const [large, setLarge] = createSignal(false);
  const external = useQrCode({ defaultValue: 'External QR' });

  /** Change the controlled QR payload. */
  function changeValue(): void {
    setValue('https://leverui.com/updated');
  }

  /** Change the inherited QR size without remounting its root. */
  function changeSize(): void {
    setLarge(!large());
  }

  /** Update the consumer owned QR machine. */
  function changeExternal(): void {
    external().setValue('Updated external QR');
  }

  return (
    <>
      <QrCode.PropsProvider value={{ size: large() ? 'lg' : 'sm' }}>
        <QrCode.Root value={value()} data-testid="qr-root">
          <QrCode.Frame data-testid="qr-frame" aria-label="Lever UI website" />
          <QrCode.Overlay data-testid="qr-overlay">UI</QrCode.Overlay>
          <QrCode.DownloadTrigger
            fileName="leverui-qr.png"
            mimeType="image/png"
            data-testid="qr-download"
          >
            Download
          </QrCode.DownloadTrigger>
          <QrCode.Context>
            {
              /** Expose the encoded value from the nearest primitive machine. */
              (context) => <output data-testid="qr-value">{context().value}</output>
            }
          </QrCode.Context>
        </QrCode.Root>
        <QrCodeRootProvider value={external} size="xs" data-testid="qr-external-root">
          <QrCode.Frame data-testid="qr-external-frame">
            <QrCode.Pattern data-testid="qr-external-pattern" />
          </QrCode.Frame>
        </QrCodeRootProvider>
        <button type="button" onClick={changeValue} data-testid="qr-value-toggle">
          Change value
        </button>
        <button type="button" onClick={changeSize} data-testid="qr-size-toggle">
          Change size
        </button>
        <button type="button" onClick={changeExternal} data-testid="qr-external-toggle">
          Change external
        </button>
        <output data-testid="qr-external-value">{external().value}</output>
      </QrCode.PropsProvider>
    </>
  );
}

const meta = {
  title: 'Content/QR Code',
  component: QrCodeContractExample,
} satisfies Meta<typeof QrCodeContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
