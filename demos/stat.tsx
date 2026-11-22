import type { Demo, DemoMeta } from './demo-types';
import { StatBasic, StatWithFormatOptions, StatWithValueUnit } from './examples/stat-standard';
import { StatWithGroup } from './examples/stat-group-display';
import {
  StatWithIcon,
  StatWithIndicator,
  StatWithInfoTip,
  StatWithProgressBar,
  StatWithTrend,
} from './examples/stat-rich';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: StatBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: StatBasic };
export const FormatOptions: Story = {
  render: StatWithFormatOptions,
  parameters: guide(
    'Use the `FormatNumber` component within `Stat.ValueText` to format the value.',
  ),
};
export const Indicator: Story = {
  render: StatWithIndicator,
  parameters: guide("Here's an example of how to display a statistic with an indicator."),
};
export const InfoTip: Story = {
  render: StatWithInfoTip,
  parameters: guide(
    'Compose a small `Popover` info tip inside `Stat.Label` to display an info tip.',
  ),
};
export const ValueUnit: Story = {
  render: StatWithValueUnit,
  parameters: guide("Here's an example of how to display a value with a unit."),
};
export const ProgressBar: Story = {
  render: StatWithProgressBar,
  parameters: guide("Here's an example of how to display a statistic with a progress bar."),
};
export const Icon: Story = {
  render: StatWithIcon,
  parameters: guide("Here's an example of how to display a statistic with an icon."),
};
export const Trend: Story = {
  render: StatWithTrend,
  parameters: guide("Here's an example of how to display a statistic with a trend indicator."),
};
export const StatGroup: Story = { render: StatWithGroup };
