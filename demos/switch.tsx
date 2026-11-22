import type { Demo, DemoMeta } from './demo-types';
import {
  SwitchWithHookForm,
  SwitchWithThumbIndicator,
  SwitchWithTooltip,
  SwitchWithTrackIndicator,
} from './examples/switch-interactive';
import {
  SwitchBasic,
  SwitchControlled,
  SwitchWithColors,
  SwitchWithDisabled,
  SwitchWithInvalid,
  SwitchWithSizes,
  SwitchWithVariants,
} from './examples/switch-standard';
import { SwitchSizeTable, SwitchVariantTable } from './examples/switch-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: SwitchBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: SwitchBasic };
export const Sizes: Story = {
  render: SwitchWithSizes,
  parameters: guide(
    'Pass the `size` prop to the `Switch.Root` component to change the size of the switch component.',
  ),
};
export const Variants: Story = {
  render: SwitchWithVariants,
  parameters: guide(
    'Pass the `variant` prop to the `Switch.Root` component to change the visual style of the switch.',
  ),
};
export const Colors: Story = {
  render: SwitchWithColors,
  parameters: guide(
    'Pass the `colorPalette` prop to the `Switch.Root` component to change the color scheme of the component.',
  ),
};
export const Controlled: Story = {
  render: SwitchControlled,
  parameters: guide(
    'Use the `checked` and `onCheckedChange` prop to control the state of the switch.',
  ),
};
export const HookForm: Story = {
  render: SwitchWithHookForm,
  parameters: guide(
    "Here's an example of integrating the switch with form state held in a Solid signal.",
  ),
};
export const Disabled: Story = {
  render: SwitchWithDisabled,
  parameters: guide(
    'Pass the `disabled` prop to the `Switch.Root` component to disable the switch.',
  ),
};
export const Invalid: Story = {
  render: SwitchWithInvalid,
  parameters: guide(
    'Pass the `invalid` prop to the `Switch.Root` component to indicate an error state for the switch.',
  ),
};
export const Tooltip: Story = {
  render: SwitchWithTooltip,
  parameters: guide("Here's an example of how to compose a switch with a tooltip."),
};
export const TrackIndicator: Story = {
  render: SwitchWithTrackIndicator,
  parameters: guide(
    'Use the `Switch.Indicator` component to display different indicators based on the checked state.',
  ),
};
export const ThumbIndicator: Story = {
  render: SwitchWithThumbIndicator,
  parameters: guide(
    'Use the `Switch.ThumbIndicator` component to add an icon to the switch thumb.',
  ),
};
export const SizeMatrix: Story = { render: SwitchSizeTable };
export const VariantMatrix: Story = { render: SwitchVariantTable };
