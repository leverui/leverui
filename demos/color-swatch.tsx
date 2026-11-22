import type { Demo, DemoMeta } from './demo-types';
import {
  ColorSwatchBasic,
  ColorSwatchMixed,
  ColorSwatchPalette,
  ColorSwatchWithAlpha,
  ColorSwatchWithBadge,
  ColorSwatchWithSizes,
  ColorSwatchWithTransparent,
} from './examples/color-swatch-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ColorSwatchBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ColorSwatchBasic };
export const WithSizes: Story = {
  render: ColorSwatchWithSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the color swatch.' },
  },
};
export const WithAlpha: Story = {
  render: ColorSwatchWithAlpha,
  parameters: {
    guide: {
      description: "Here's an example of how to create a color swatch with an alpha channel.",
    },
  },
};
export const WithBadge: Story = {
  render: ColorSwatchWithBadge,
  parameters: {
    guide: { description: "Here's an example of how to compose the `ColorSwatch` with a `Badge`." },
  },
};
export const Mixed: Story = {
  render: ColorSwatchMixed,
  parameters: {
    guide: {
      description:
        'Use the `ColorSwatchMix` to create a color swatch that contains multiple colors, but retains the size of a single color swatch.',
    },
  },
};
export const Palette: Story = {
  render: ColorSwatchPalette,
  parameters: {
    guide: { description: "Here's an example of composing multiple swatches to create a palette." },
  },
};
export const WithTransparent: Story = { render: ColorSwatchWithTransparent };
