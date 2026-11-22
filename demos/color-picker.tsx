import type { Demo, DemoMeta } from './demo-types';
import './examples/color-picker-examples.css';
import { withComponentInset } from './examples/example-frame';
import {
  ColorPickerChannelInput,
  ColorPickerChannelSliderOnly,
  ColorPickerInputOnly,
  ColorPickerTriggerInInput,
} from './examples/color-picker-channel-examples';
import {
  ColorPickerInline,
  ColorPickerSwatchAndInput,
  ColorPickerSwatchOnly,
  ColorPickerSwatchesAndTrigger,
  ColorPickerTriggerOnly,
} from './examples/color-picker-display-examples';
import { ColorPickerSizes, ColorPickerVariants } from './examples/color-picker-matrix-examples';
import { ColorPickerSaveSwatch } from './examples/color-picker-save-swatch-example';
import {
  ColorPickerHookForm,
  ColorPickerOpenFromDialog,
} from './examples/color-picker-form-examples';
import { ColorPickerFormat, ColorPickerSwatches } from './examples/color-picker-format-examples';
import {
  ColorPickerBasic,
  ColorPickerDisabled,
  ColorPickerFitContent,
  ColorPickerReadonly,
} from './examples/color-picker-standard-examples';
import {
  ColorPickerChangeEnd,
  ColorPickerControlled,
  ColorPickerWithStore,
} from './examples/color-picker-state-examples';

export const meta = {
  component: ColorPickerBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a description and optional Markdown shown after the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { name: 'Basic', render: ColorPickerBasic };
export const Sizes: Story = {
  name: 'Sizes',
  render: ColorPickerSizes,
  parameters: guide('Use the `size` prop to change the size of the color picker.'),
};
export const Variants: Story = {
  name: 'Variants',
  render: ColorPickerVariants,
  parameters: guide(
    'Use the `variant` prop to change the visual style of the color picker. Values can be either `outline` or `subtle`.',
  ),
};
export const InputOnly: Story = {
  name: 'InputOnly',
  render: ColorPickerInputOnly,
  parameters: guide(
    'Combine the `ColorPicker.ValueSwatch` and the `ColorPicker.EyeDropper` on the `InputGroup` to render a color picker that contains only an input.',
  ),
};
export const SwatchOnly: Story = {
  name: 'SwatchOnly',
  render: ColorPickerSwatchOnly,
  parameters: guide(
    'Use the `ColorPicker.SwatchGroup` and `ColorPicker.SwatchTrigger` to render only the color swatches.',
  ),
};
export const TriggerOnly: Story = {
  name: 'TriggerOnly',
  render: ColorPickerTriggerOnly,
  parameters: guide(
    'Compose the color picker to initially show only a trigger using the `ColorPicker.ValueSwatch` and `ColorPicker.ValueText`.',
  ),
};
export const TriggerInsideInput: Story = {
  name: 'TriggerInsideInput',
  render: ColorPickerTriggerOnly,
  parameters: guide(
    'Compose the color picker to trigger in input using the `InputGroup` and `ColorPickerInput`.',
  ),
};
export const Controlled: Story = {
  name: 'Controlled',
  render: ColorPickerControlled,
  parameters: guide(
    'Use the `value` and `onValueChange` props to control the state of the color picker.',
  ),
};
export const Store: Story = {
  name: 'Store',
  render: ColorPickerWithStore,
  parameters: guide(
    'An alternative way to control the color picker is to use the `RootProvider` component and the `useColorPicker` store hook.',
    'This way you can access the color picker state and methods from outside the color picker.',
  ),
};
export const ChangeEnd: Story = {
  name: 'ChangeEnd',
  render: ColorPickerChangeEnd,
  parameters: guide(
    'Use the `onValueChangeEnd` to listen to when the user finishes selecting a color, rather than while they are scrubbing or dragging through the color area.',
  ),
};
export const ChannelSliderOnly: Story = {
  name: 'ChannelSliderOnly',
  render: ColorPickerChannelSliderOnly,
  parameters: guide(
    'Combine the `ColorPickerChannelSliders` and the `format` prop to add the different color channels to the color picker.',
  ),
};
export const HookForm: Story = {
  name: 'HookForm',
  render: ColorPickerHookForm,
  parameters: guide(
    "Here's an example of how to integrate the color picker with a form, holding the value in a Solid signal.",
  ),
};
export const Inline: Story = {
  name: 'Inline',
  render: ColorPickerInline,
  parameters: guide("Here's an example of how to display an inline version of the color picker."),
};
export const OpenFromDialog: Story = {
  name: 'OpenFromDialog',
  render: ColorPickerOpenFromDialog,
  parameters: guide(
    "To use the color picker within a dialog, avoid portalling the `ColorPicker.Positioner` to the document's body.",
  ),
};
export const Disabled: Story = {
  name: 'Disabled',
  render: ColorPickerDisabled,
  parameters: guide('Pass the `disabled` prop to disable the color picker.'),
};
export const ChannelInput: Story = {
  name: 'ChannelInput',
  render: ColorPickerChannelInput,
  parameters: guide(
    'Use the `ChannelFormat.Select` and `ColorPicker.ChannelInput` to create a color picker that allows users to select their preferred channel.',
  ),
};
export const FitContent: Story = {
  name: 'FitContent',
  render: ColorPickerFitContent,
  parameters: guide(
    'Pass the `data-fit-content` attribute to the `ColorPicker.Trigger` to make it fit the content.',
    '### ReadOnly\n\nUse the `readOnly` prop to make the color picker component read-only.',
  ),
};
export const SaveSwatch: Story = {
  name: 'SaveSwatch',
  render: ColorPickerSaveSwatch,
  parameters: guide("Here's an example of how to save a selected color as a swatch."),
};
export const Swatches: Story = {
  name: 'Swatches',
  render: ColorPickerSwatches,
  parameters: guide(
    "Here's an example of how to combine the color picker with pre-defined swatches.",
  ),
};
export const SwatchAndInput: Story = {
  name: 'SwatchAndInput',
  render: ColorPickerSwatchAndInput,
  parameters: guide("Here's how to compose a swatch with an input."),
};
export const SwatchAndTrigger: Story = {
  name: 'SwatchAndTrigger',
  render: ColorPickerSwatchAndInput,
  parameters: guide("Here's how to compose a swatch with a trigger."),
};
export const Format: Story = { name: 'Format', render: ColorPickerFormat };
export const Readonly: Story = { name: 'Readonly', render: ColorPickerReadonly };
export const SwatchesAndTrigger: Story = {
  name: 'SwatchesAndTrigger',
  render: ColorPickerSwatchesAndTrigger,
};
export const TriggerInInput: Story = { name: 'TriggerInInput', render: ColorPickerTriggerInInput };
