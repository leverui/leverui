import type { Demo, DemoMeta } from './demo-types';
import {
  FormatNumberBasic,
  FormatNumberWithCompact,
  FormatNumberWithCurrency,
  FormatNumberWithLocale,
  FormatNumberWithPercentage,
  FormatNumberWithUnit,
} from './examples/format-number-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: FormatNumberBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: FormatNumberBasic };
export const Percentage: Story = {
  render: FormatNumberWithPercentage,
  parameters: {
    guide: {
      description: 'Use the `style="percent"` prop to change the number format to percentage.',
    },
  },
};
export const Currency: Story = {
  render: FormatNumberWithCurrency,
  parameters: {
    guide: {
      description: 'Use the `style="currency"` prop to change the number format to currency.',
    },
  },
};
export const Locale: Story = {
  render: FormatNumberWithLocale,
  parameters: {
    guide: {
      description:
        'Wrap the `FormatNumber` component within the `LocaleProvider` to change the locale.',
    },
  },
};
export const Unit: Story = {
  render: FormatNumberWithUnit,
  parameters: {
    guide: { description: 'Use the `style="unit"` prop to change the number format to unit.' },
  },
};
export const CompactNotation: Story = {
  render: FormatNumberWithCompact,
  parameters: {
    guide: {
      description:
        'Use the `notation="compact"` prop to change the number format to compact notation.',
    },
  },
};
