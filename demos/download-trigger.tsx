import type { Demo, DemoMeta } from './demo-types';
import {
  DownloadTriggerBasic,
  DownloadTriggerSvg,
  DownloadTriggerWithFileSize,
  DownloadTriggerWithPromise,
} from './examples/download-trigger-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: DownloadTriggerBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: DownloadTriggerBasic };
export const BasicExample: Story = {
  render: DownloadTriggerBasic,
  parameters: guide(
    'Pass the data you want to download to the `data` prop, and specify the `fileName` and `mimeType` of the file.',
  ),
};
export const Svg: Story = {
  render: DownloadTriggerSvg,
  parameters: guide("Here's an example of how to download an SVG file."),
};
export const Promise: Story = {
  render: DownloadTriggerWithPromise,
  parameters: guide(
    'You can also trigger downloads from a promise that returns a `Blob`, `File`, or `string`.',
  ),
};
export const FileSize: Story = {
  render: DownloadTriggerWithFileSize,
  parameters: guide(
    'Compose the `DownloadTrigger` with the `FormatByte` component to display the size of the file in a human-readable format.',
  ),
};
