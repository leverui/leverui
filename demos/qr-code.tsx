import type { Demo, DemoMeta } from './demo-types';
import {
  QrCodeBasic,
  QrCodeWithFill,
  QrCodeWithOverlay,
  QrCodeWithSizes,
  QrCodeWithSpinner,
} from './examples/qr-code-display';
import { QrCodeWithExport, QrCodeWithExportWithLogo } from './examples/qr-code-download';
import {
  QrCodeWithErrorLevel,
  QrCodeWithInput,
  QrCodeWithStore,
} from './examples/qr-code-interactive';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: QrCodeBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description, and any Markdown that follows the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: QrCodeBasic };
export const WithSizes: Story = {
  render: QrCodeWithSizes,
  parameters: guide('Use the `size` prop to set the size of the QR code.'),
};
export const WithOverlay: Story = {
  render: QrCodeWithOverlay,
  parameters: guide(
    'Pass the children prop to the `QrCode.Overlay` component to add a logo or overlay to the QR code.',
  ),
};
export const WithFill: Story = {
  render: QrCodeWithFill,
  parameters: guide('Use the `fill` prop to set the fill color of the QR code.'),
};
export const WithExport: Story = {
  render: QrCodeWithExport,
  parameters: guide(
    'Use the `QrCode.DownloadTrigger` to download the QR code.',
    '> The `fileName` and the `mimeType` props are required.',
  ),
};
export const WithErrorLevel: Story = {
  render: QrCodeWithErrorLevel,
  parameters: guide(
    'In cases where the link is too long or the logo overlay covers a significant area, the error correction level can be increased.',
    'Use the `encoding.ecc` or `encoding.boostEcc` property to set the error correction level:\n\n- `L`: Allows recovery of up to 7% data loss (default)\n- `M`: Allows recovery of up to 15% data loss\n- `Q`: Allows recovery of up to 25% data loss\n- `H`: Allows recovery of up to 30% data loss',
  ),
};
export const WithStore: Story = {
  render: QrCodeWithStore,
  parameters: guide(
    'The `RootProvider` component provides a context for the QR code.',
    'It accepts the value of the `useQrCode` hook. You can leverage it to access the component state and methods from outside the QR code.',
  ),
};
export const WithInput: Story = {
  render: QrCodeWithInput,
  parameters: guide(
    "Here's an example of how to use the `QrCode` component with an `Input` component.",
  ),
};
export const WithSpinner: Story = {
  render: QrCodeWithSpinner,
  parameters: guide(
    "Here's an example of how to use the `QrCode` component with a `Spinner` component.",
  ),
};
export const WithExportLogo: Story = { render: QrCodeWithExportWithLogo };
