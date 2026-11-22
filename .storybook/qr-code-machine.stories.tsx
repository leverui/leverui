import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { QrCode, type QrCodeValueChangeDetails } from '../src';

/** Exercise uncontrolled values, callbacks, encoding, and pixel geometry. */
function QrCodeMachineExample(): JSX.Element {
  const [ecc, setEcc] = createSignal<'L' | 'H'>('L');
  const [boost, setBoost] = createSignal(false);
  const [pixelSize, setPixelSize] = createSignal(5);
  const [reported, setReported] = createSignal('none');

  /** Report Zag's uncontrolled value change details. */
  function recordValue(details: QrCodeValueChangeDetails): void {
    setReported(details.value);
  }

  /** Increase error correction while keeping the payload fixed. */
  function raiseEcc(): void {
    setEcc('H');
  }

  /** Restore the baseline error correction level. */
  function lowerEcc(): void {
    setEcc('L');
  }

  /** Allow Zag to boost correction without changing the version. */
  function enableBoost(): void {
    setBoost(true);
  }

  /** Double the machine's SVG pixel geometry. */
  function enlargePixels(): void {
    setPixelSize(10);
  }

  return (
    <>
      <QrCode.Root
        defaultValue="Initial QR"
        encoding={{ ecc: ecc(), boostEcc: boost() }}
        pixelSize={pixelSize()}
        onValueChange={recordValue}
        ids={{ root: 'machine-qr-root', frame: 'machine-qr-frame' }}
      >
        <QrCode.Frame aria-label="Machine QR code" data-testid="machine-qr-frame" />
        <QrCode.DownloadTrigger
          fileName="machine-qr.png"
          mimeType="image/png"
          data-testid="machine-qr-download"
        >
          Download
        </QrCode.DownloadTrigger>
        <QrCode.Context>
          {
            /** Read and update the nearest QR machine. */
            (context) => (
              <>
                <output data-testid="machine-qr-value">{context().value}</output>
                <button
                  type="button"
                  onClick={
                    /** Send a new uncontrolled value through Zag. */
                    () => context().setValue('Updated QR')
                  }
                  data-testid="machine-qr-value-toggle"
                >
                  Change value
                </button>
              </>
            )
          }
        </QrCode.Context>
      </QrCode.Root>
      <output data-testid="machine-qr-reported">{reported()}</output>
      <button type="button" onClick={raiseEcc} data-testid="machine-qr-ecc-high">
        High ECC
      </button>
      <button type="button" onClick={lowerEcc} data-testid="machine-qr-ecc-low">
        Low ECC
      </button>
      <button type="button" onClick={enableBoost} data-testid="machine-qr-boost">
        Boost ECC
      </button>
      <button type="button" onClick={enlargePixels} data-testid="machine-qr-pixels">
        Larger pixels
      </button>
    </>
  );
}

const meta = {
  title: 'Content/QR Code Machine',
  component: QrCodeMachineExample,
} satisfies Meta<typeof QrCodeMachineExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
