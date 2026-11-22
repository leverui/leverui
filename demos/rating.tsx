import type { Demo, DemoMeta } from './demo-types';
import {
  RatingColors,
  RatingCustomIcon,
  RatingEmoji,
  RatingSizeMatrix,
  RatingSizes,
} from './examples/rating-custom';
import { RatingHookForm, RatingTestimonial } from './examples/rating-composite';
import {
  RatingBasic,
  RatingControlled,
  RatingHalf,
  RatingLabel,
  RatingReadOnly,
  RatingStore,
} from './examples/rating-simple';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: RatingBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description, and any Markdown that follows the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: RatingBasic };
export const BasicExample: Story = { render: RatingBasic };
export const Sizes: Story = {
  render: RatingSizes,
  parameters: guide('Use the `size` prop to change the size of the rating component.'),
};
export const Controlled: Story = {
  render: RatingControlled,
  parameters: guide('Use the `value` and `onValueChange` prop to control the rating value.'),
};
export const Store: Story = {
  render: RatingStore,
  parameters: guide(
    'An alternative way to control the rating is to use the `RootProvider` component and the `useRatingGroup` store hook.',
    'This way you can access the rating state and methods from outside the component.',
  ),
};
export const ReadOnly: Story = {
  render: RatingReadOnly,
  parameters: guide('Use the `readOnly` prop to make the rating component read-only.'),
};
export const HookForm: Story = {
  render: RatingHookForm,
  parameters: guide(
    "Here's an example of how to use rating with form state held in a Solid signal.",
  ),
};
export const CustomIcon: Story = {
  render: RatingCustomIcon,
  parameters: guide(
    'Use the `icon` prop to pass a custom icon to the rating component. This will override the default star icon.',
  ),
};
export const Label: Story = {
  render: RatingLabel,
  parameters: guide(
    'Render the `RatingGroup.Label` component to provide a human-readable label for the rating component.',
  ),
};
export const Half: Story = {
  render: RatingHalf,
  parameters: guide('Use the `allowHalf` prop to allow half-star ratings.'),
};
export const Emoji: Story = {
  render: RatingEmoji,
  parameters: guide('Compose the rating component with emojis.'),
};
export const Colors: Story = {
  render: RatingColors,
  parameters: guide('Use the `colorPalette` prop to change the color of the rating'),
};
export const Testimonial: Story = {
  render: RatingTestimonial,
  parameters: guide('Use the rating component to show testimonials.'),
};
export const SizeMatrix: Story = { render: RatingSizeMatrix };
