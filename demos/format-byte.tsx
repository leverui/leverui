import type { Demo, DemoMeta } from './demo-types';
import {
  FormatByteBasic,
  FormatByteSizes,
  FormatByteWithLocale,
  FormatByteWithUnit,
  FormatByteWithUnitDisplay,
} from './examples/format-byte-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: FormatByteBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: FormatByteBasic };
export const Sizes: Story = {
  render: FormatByteSizes,
  parameters: { guide: { description: 'The format functions works for any size of bytes.' } },
};
export const FormatBits: Story = {
  render: FormatByteWithUnit,
  parameters: { guide: { description: 'Use the `unit` prop to change the byte format to bits.' } },
};
export const Locale: Story = {
  render: FormatByteWithLocale,
  parameters: {
    guide: {
      description:
        'Wrap the `FormatByte` component within the `LocaleProvider` to change the locale.',
    },
  },
};
export const UnitDisplay: Story = {
  render: FormatByteWithUnitDisplay,
  parameters: {
    guide: {
      description: 'Use the `unitDisplay` prop to change the byte format to compact notation.',
    },
  },
};
