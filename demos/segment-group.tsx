import type { Demo, DemoMeta } from './demo-types';
import { SegmentGroup } from '../src';
import { SegmentGroupCard } from './examples/segment-group-card';
import { SegmentGroupColorPalette } from './examples/segment-group-color-palette';
import { SegmentGroupIcon } from './examples/segment-group-icon';
import { SegmentGroupHookForm } from './examples/segment-group-form';
import {
  SegmentGroupBasic,
  SegmentGroupControlled,
  SegmentGroupCustomIndicator,
  SegmentGroupDisabled,
  SegmentGroupDisabledItem,
  SegmentGroupSizes,
  SegmentGroupVertical,
} from './examples/segment-group-simple';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: SegmentGroup.Root,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: SegmentGroupBasic };
export const Sizes: Story = {
  render: SegmentGroupSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the segmented control.' },
  },
};
export const Controlled: Story = {
  render: SegmentGroupControlled,
  parameters: {
    guide: {
      description: 'Use the `value` and `onValueChange` props to control the selected item.',
    },
  },
};
export const HookForm: Story = {
  render: SegmentGroupHookForm,
  parameters: {
    guide: {
      description:
        "Here's an example of how to use the `SegmentGroup` in a form with a Solid signal holding its value.",
    },
  },
};
export const Vertical: Story = {
  render: SegmentGroupVertical,
  parameters: {
    guide: {
      description:
        'By default, the segmented control is horizontal. Set the `orientation` prop to `vertical` to change the orientation of the segmented control.',
    },
  },
};
export const Disabled: Story = {
  render: SegmentGroupDisabled,
  parameters: {
    guide: { description: 'Use the `disabled` prop to disable the segmented control.' },
  },
};
export const DisabledItem: Story = {
  render: SegmentGroupDisabledItem,
  parameters: { guide: { description: 'Use the `disabled` prop on the item to disable it.' } },
};
export const CustomIndicator: Story = {
  render: SegmentGroupCustomIndicator,
  parameters: {
    guide: {
      description:
        'Customize the indicator appearance using CSS variables like `--leverui-segment-group-indicator-background` and `--leverui-segment-group-indicator-shadow`.',
    },
  },
};
export const ColorPalette: Story = {
  render: SegmentGroupColorPalette,
  parameters: {
    guide: {
      description:
        "By default, the segment control doesn't change its design based on a color palette. This example shows how to customize the segmented control with CSS to use one.",
    },
  },
};
export const Icon: Story = {
  render: SegmentGroupIcon,
  parameters: {
    guide: { description: 'Render the `label` as a `JSX.Element` to render an icon.' },
  },
};
export const Card: Story = {
  render: SegmentGroupCard,
  parameters: {
    guide: {
      description: "Here's an example of how to use the `SegmentGroup` within a `Card`.",
    },
  },
};
