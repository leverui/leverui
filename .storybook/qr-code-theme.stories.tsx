import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { QrCode, Theme } from '../src';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;

/** Expose every size and customization path for browser verification. */
function QrCodeThemeExample(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', gap: '8px', 'flex-wrap': 'wrap' }}>
        {sizes.map(
          /** Render one isolated authored QR size. */
          (size) => (
            <QrCode.Root value={`Size ${size}`} size={size} data-testid={`qr-size-${size}`}>
              <QrCode.Frame data-testid={`qr-frame-${size}`} />
            </QrCode.Root>
          ),
        )}
      </div>
      <QrCode.Root value="Responsive QR" size={{ base: '2xs', md: 'xl' }}>
        <QrCode.Frame data-testid="qr-responsive-frame" />
      </QrCode.Root>
      <QrCode.Root value="Custom CSS" style={{ '--lui-qr-code-size': '173px' }}>
        <QrCode.Frame data-testid="qr-custom-frame" />
      </QrCode.Root>
      <QrCode.Root value="Unstyled QR" unstyled data-testid="qr-unstyled-root">
        <QrCode.Frame data-testid="qr-unstyled-frame" />
      </QrCode.Root>
      <QrCode.Root value="Outside QR" size="sm" data-testid="qr-outer-root">
        <QrCode.Frame data-testid="qr-override-frame" />
        <QrCode.Root value="Inside QR" size="2xl" data-testid="qr-inner-root">
          <QrCode.Frame />
        </QrCode.Root>
      </QrCode.Root>
      <Theme appearance="dark" hasBackground={false} data-testid="qr-dark-scope">
        <QrCode.Root value="Dark QR">
          <QrCode.Frame />
          <QrCode.Overlay data-testid="qr-dark-overlay">UI</QrCode.Overlay>
        </QrCode.Root>
        <Theme appearance="light" hasBackground={false} data-testid="qr-light-scope">
          <QrCode.Root value="Light QR">
            <QrCode.Frame />
            <QrCode.Overlay data-testid="qr-light-overlay">UI</QrCode.Overlay>
          </QrCode.Root>
        </Theme>
      </Theme>
    </>
  );
}

const meta = {
  title: 'Content/QR Code Theme',
  component: QrCodeThemeExample,
} satisfies Meta<typeof QrCodeThemeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
