import type { Demo, DemoMeta } from './demo-types';
import {
  SpinnerBasic,
  SpinnerCustomColor,
  SpinnerSizeTable,
  SpinnerWithColors,
  SpinnerWithSizes,
  SpinnerWithCustomSpeed,
  SpinnerWithCustomThickness,
  SpinnerWithCustomIndicator,
  SpinnerWithTrackColor,
  SpinnerWithLabel,
  SpinnerWithOverlay,
} from './examples/spinner-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: SpinnerBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a description and the example's authored CSS. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: SpinnerBasic };
export const Sizes: Story = {
  render: SpinnerWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the spinner.' },
  },
};
export const Colors: Story = {
  render: SpinnerWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color scheme of the spinner.'),
};
export const SizeMatrix: Story = { name: 'SizeMatrix', render: SpinnerSizeTable };
export const CustomColor: Story = {
  render: SpinnerCustomColor,
  parameters: guide('Set the CSS `color` property to pass a custom color to the spinner.'),
};
export const CustomSpeed: Story = {
  render: SpinnerWithCustomSpeed,
  parameters: guide(
    'Set the CSS `animation-duration` property to change the speed of the spinner.',
  ),
};
export const CustomThickness: Story = {
  render: SpinnerWithCustomThickness,
  parameters: guide('Set the CSS `border-width` property to change the thickness of the spinner.'),
};
export const CustomIndicator: Story = {
  render: SpinnerWithCustomIndicator,
  parameters: guide('Use the `asChild` prop to render a custom icon as the spinner.'),
};
export const TrackColor: Story = {
  render: SpinnerWithTrackColor,
  parameters: guide(
    "Use the `--leverui-spinner-track-color` variable to change the color of the spinner's track.",
  ),
};
export const Label: Story = {
  render: SpinnerWithLabel,
  parameters: guide('Compose the spinner with a label to provide additional context.'),
};
export const Overlay: Story = {
  render: SpinnerWithOverlay,
  parameters: guide(
    'Compose spinner with the `Center` component to overlay the spinner on top of another component.',
  ),
};
