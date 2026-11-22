import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { CardWithSizes, CardWithVariants } from './examples/card-guide';
import { CardWithAvatar, CardWithForm } from './examples/card-interactive';
import { CardBasic, CardHorizontal, CardWithImage } from './examples/card-standard';
import { CardSizeTable, CardVariantTable } from './examples/card-tables';
import './examples/card.css';

export const meta = {
  component: CardBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: CardBasic };
export const Variants: Story = {
  render: CardWithVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the Card.'),
};
export const Form: Story = {
  render: CardWithForm,
  parameters: guide('Use the Card component within a form to group related fields together.'),
};
export const Sizes: Story = {
  render: CardWithSizes,
  parameters: guide('Use the `size` prop to change the size of the Card.'),
};
export const Image: Story = {
  render: CardWithImage,
  parameters: guide('Use the Card component to display an image.'),
};
export const Horizontal: Story = {
  render: CardHorizontal,
  parameters: guide('Use the Card component to display content horizontally.'),
};
export const Avatar: Story = {
  render: CardWithAvatar,
  parameters: guide('Use the Card component to display an avatar.'),
};
export const VariantMatrix: Story = { render: CardVariantTable };
export const SizeMatrix: Story = { render: CardSizeTable };
