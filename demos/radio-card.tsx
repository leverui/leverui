import type { Demo, DemoMeta } from './demo-types';
import {
  RadioCardColors,
  RadioCardSizes,
  RadioCardVariants,
} from './examples/radio-card-appearance';
import { RadioCardComposition, RadioCardCustomIndicator } from './examples/radio-card-composition';
import { withComponentInset } from './examples/example-frame';
import { RadioCardCentered, RadioCardIcon } from './examples/radio-card-icons';
import {
  RadioCardResponsiveOrientation,
  RadioCardWithoutIndicator,
  RadioCardWithoutIndicatorVertical,
} from './examples/radio-card-payments';
import {
  RadioCardAddon,
  RadioCardBasic,
  RadioCardControlled,
  RadioCardDescription,
} from './examples/radio-card-standard';

export const meta = {
  component: RadioCardBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description, and any Markdown that follows the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: RadioCardBasic };
export const Description: Story = {
  render: RadioCardDescription,
  parameters: guide("Here's an example of how to add some further description to the radio card."),
};
export const Sizes: Story = {
  render: RadioCardSizes,
  parameters: guide(
    'Pass the `size` prop to the `RadioCard.Root` component to change the size of the radio card.',
  ),
};
export const Colors: Story = {
  render: RadioCardColors,
  parameters: guide(
    'Pass the `colorPalette` prop to the `RadioCard.Root` component to change the color of the radio card.',
  ),
};
export const Variants: Story = {
  render: RadioCardVariants,
  parameters: guide(
    'Pass the `variant` prop to the `RadioCard.Root` component to change the visual style of the radio card.',
  ),
};
export const Icon: Story = {
  render: RadioCardIcon,
  parameters: guide(
    'Render a custom icon inside the radio card by placing it within `RadioCard.ItemContent`.',
  ),
};
export const Controlled: Story = {
  render: RadioCardControlled,
  parameters: guide(
    'Pass the `value` and `onValueChange` props to the RadioCard.Root component to control the selected radio card.',
  ),
};
export const WithoutIndicator: Story = {
  render: RadioCardWithoutIndicator,
  parameters: guide("Here's an example of how to use the radio card without an indicator."),
};
export const WithoutIndicatorVertical: Story = {
  render: RadioCardWithoutIndicatorVertical,
  parameters: guide(
    "Here's an example of a radio card with no indicator and content aligned vertically.",
  ),
};
export const ResponsiveOrientation: Story = {
  render: RadioCardResponsiveOrientation,
  parameters: guide(
    "Use `useBreakpointValue` for responsive orientation — the `orientation` prop doesn't support responsive object notation.",
    '> Alternatively, render two `RadioCard.Root` instances (one horizontal, one vertical) and show or hide them by breakpoint using CSS `display`.',
  ),
};
export const Centered: Story = {
  render: RadioCardCentered,
  parameters: guide("Here's an example of a radio card with centered text."),
};
export const Composition: Story = {
  render: RadioCardComposition,
  parameters: guide("Here's an example of composing the RadioCard with the `Group` component."),
};
export const Addon: Story = {
  render: RadioCardAddon,
  parameters: guide('Use the `RadioCard.ItemAddon` component to add metadata to the radio card.'),
};
export const CustomIndicator: Story = { render: RadioCardCustomIndicator };
