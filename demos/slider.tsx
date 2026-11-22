import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  SliderSizes as SliderSizeMatrix,
  SliderVariants as SliderVariantMatrix,
} from './examples/slider-matrices';
import {
  SliderCustomMarkerLabels,
  SliderDraggingIndicator,
  SliderMarks,
  SliderMarksAndLabel,
  SliderMarksVertical,
} from './examples/slider-markers';
import {
  SliderChangeEnd,
  SliderControlled,
  SliderCustomization,
  SliderHookForm,
  SliderStore,
} from './examples/slider-state';
import {
  SliderBasic,
  SliderColors,
  SliderDisabled,
  SliderLabel,
  SliderStep,
  SliderValueText,
  SliderVertical,
  SliderWithSizes,
  SliderWithVariants,
} from './examples/slider-standard';
import {
  SliderCollisionBehavior,
  SliderPreventOverlap,
  SliderRangeSlider,
  SliderThumbAlignment,
} from './examples/slider-thumbs';
import { markdownGuide } from './guide-markdown';

export const meta = {
  component: SliderBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: SliderBasic };
export const Sizes: Story = {
  render: SliderWithSizes,
  parameters: guide('Use the `size` prop to change the size of the slider.'),
};
export const Variants: Story = {
  render: SliderWithVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the slider.'),
};
export const SizeMatrix: Story = { name: 'SizeMatrix', render: SliderSizeMatrix };
export const VariantMatrix: Story = { name: 'VariantMatrix', render: SliderVariantMatrix };
export const Colors: Story = {
  render: SliderColors,
  parameters: guide('Use the `colorPalette` prop to change the color of the slider.'),
};
export const Label: Story = {
  render: SliderLabel,
  parameters: guide('Use the `Slider.Label` component to add a label to the slider.'),
};
export const RangeSlider: Story = {
  render: SliderRangeSlider,
  parameters: guide('Set the `value` or `defaultValue` prop to an array to create a range slider.'),
};
export const PreventOverlap: Story = {
  render: SliderPreventOverlap,
  parameters: guide('Use the `minStepsBetweenThumbs` prop to avoid thumbs with the same value.'),
};
export const CollisionBehavior: Story = {
  render: SliderCollisionBehavior,
  parameters: guide(
    'Use the `thumbCollisionBehavior` prop to control how thumbs interact when they collide. Options are `"none"` (default), `"push"`, or `"swap"`.',
  ),
};
export const Customization: Story = {
  render: SliderCustomization,
  parameters: guide("Here's an example of customizing the thumb with custom icon and background."),
};
export const ValueText: Story = {
  render: SliderValueText,
  parameters: guide(
    'Use the `Slider.ValueText` component to show the current value of the slider.',
  ),
};
export const Controlled: Story = {
  render: SliderControlled,
  parameters: guide(
    'Use the `value` and `onValueChange` props to control the value of the slider.',
  ),
};
export const Store: Story = {
  render: SliderStore,
  parameters: markdownGuide(
    guide(
      'An alternative way to control the slider is to use the `RootProvider` component and the `useSlider` store function.\n\nThis way you can access the slider state and methods from outside the slider.',
    ),
  ),
};
export const HookForm: Story = {
  render: SliderHookForm,
  parameters: guide(
    "Here's an example of how to validate a slider with form state held in a Solid signal.",
  ),
};
export const Disabled: Story = {
  render: SliderDisabled,
  parameters: guide('Use the `disabled` prop to disable the slider.'),
};
export const ChangeEnd: Story = {
  render: SliderChangeEnd,
  parameters: guide('Use the `onValueChangeEnd` prop to listen to the end of the slider change.'),
};
export const Step: Story = {
  render: SliderStep,
  parameters: guide('Use the `step` prop to set the step value of the slider.'),
};
export const ThumbAlignment: Story = {
  render: SliderThumbAlignment,
  parameters: guide(
    'Use the `thumbAlignment` and `thumbSize` prop to align the thumb within the track. By default, the thumb is aligned to the start of the track.',
  ),
};
export const Marks: Story = {
  render: SliderMarks,
  parameters: guide('Use the `marks` prop to display marks on the slider.'),
};
export const MarksAndLabel: Story = {
  render: SliderMarksAndLabel,
  parameters: {
    guide: {
      heading: false,
      description: 'You can also add labels to the marks using the `marks` prop.',
    },
  },
};
export const CustomMarkerLabels: Story = {
  render: SliderCustomMarkerLabels,
  parameters: guide(
    'Compose `Slider.Marker`, `Slider.MarkerIndicator`, and `Slider.MarkerLabel` to customize each marker independently.',
  ),
};
export const Vertical: Story = {
  render: SliderVertical,
  parameters: guide('Use the `orientation` prop to change the orientation of the slider.'),
};
export const MarksVertical: Story = {
  render: SliderMarksVertical,
  parameters: guide("Here's an example of a vertical slider with marks."),
};
export const DraggingIndicator: Story = {
  render: SliderDraggingIndicator,
  parameters: markdownGuide(
    guide(
      'Render the `Slider.DraggingIndicator` component to show an indicator or tooltip when dragging the thumb.\n\n> Pro Tip: You can render the `Slider.ValueText` component inside the `Slider.DraggingIndicator` to show the current value.',
    ),
  ),
};
