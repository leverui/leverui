import type { Demo, DemoMeta } from './demo-types';
import {
  InputEndAddon,
  InputEndButton,
  InputEndIcon,
  InputEndText,
  InputKbd,
  InputSelect,
  InputStartAddon,
  InputStartAndEndAddon,
  InputStartAndEndText,
  InputStartElementEndAddon,
  InputStartIcon,
  InputStartText,
} from './examples/input-adornments';
import { withComponentInset } from './examples/example-frame';
import {
  InputErrorText,
  InputField,
  InputFloatingLabel,
  InputFocusErrorColor,
  InputHelperText,
  InputHookForm,
} from './examples/input-fields';
import { InputCharacterCounter, InputClearButton, InputMask } from './examples/input-interactions';
import {
  InputBasic,
  InputDisabled,
  InputPlaceholderStyle,
  InputSizeMatrix,
  InputSizes,
  InputVariantMatrix,
  InputVariants,
} from './examples/input-matrices';
import { InputCardDetails } from './examples/input-card-details';
import { InputCardNumber } from './examples/input-card-number';

export const meta = {
  component: InputBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach guide copy to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

/** Group an example under the previous heading with a sub-heading. */
function sub(subheading: string, description?: string): Story['parameters'] {
  return { guide: { subheading, ...(description ? { description } : { heading: false }) } };
}

export const Basic: Story = { render: InputBasic };
export const Variants: Story = {
  render: InputVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the input.'),
};
export const Sizes: Story = {
  render: InputSizes,
  parameters: guide('Use the `size` prop to change the size of the input.'),
};
export const HelperText: Story = {
  render: InputHelperText,
  parameters: guide('Pair the input with the `Field` component to add helper text.'),
};
export const ErrorText: Story = {
  render: InputErrorText,
  parameters: guide('Pair the input with the `Field` component to add error text.'),
};
export const Field: Story = {
  render: InputField,
  parameters: guide(
    'Compose the input with the `Field` component to add a label, helper text, and error text.',
  ),
};
export const HookForm: Story = {
  render: InputHookForm,
  parameters: guide(
    "Here's an example of how to integrate the input with a native Solid form submission.",
  ),
};
export const StartIcon: Story = {
  render: InputStartIcon,
  parameters: sub(
    'Start Icon',
    'Use the `startElement` and `endElement` on the `InputGroup` component to add an element to the start and end of the input.',
  ),
};
export const StartText: Story = { render: InputStartText, parameters: sub('Start Text') };
export const StartAndEndText: Story = {
  render: InputStartAndEndText,
  parameters: sub('Start and End Text'),
};
export const Kbd: Story = { render: InputKbd, parameters: sub('Kbd') };
export const Select: Story = { render: InputSelect, parameters: sub('Select') };
export const StartAddon: Story = {
  render: InputStartAddon,
  parameters: sub(
    'Start Addon',
    'Use the `InputAddon` and `Group` components to add an addon to the input.',
  ),
};
export const EndAddon: Story = { render: InputEndAddon, parameters: sub('End Addon') };
export const StartAndEndAddon: Story = {
  render: InputStartAndEndAddon,
  parameters: sub('Start and End Addon'),
};
export const Disabled: Story = {
  render: InputDisabled,
  parameters: guide('Use the `disabled` prop to disable the input.'),
};
export const EndButton: Story = {
  render: InputEndButton,
  parameters: guide('Use the `Group` component to attach a button to the input.'),
};
export const FocusErrorColor: Story = {
  render: InputFocusErrorColor,
  parameters: guide(
    'Use the `--lui-input-focus-color` and `--lui-input-error-color` CSS custom properties to change the color of the input when it is focused or in an error state.',
  ),
};
export const PlaceholderStyle: Story = {
  render: InputPlaceholderStyle,
  parameters: {
    guide: {
      description: 'Use the `::placeholder` pseudo-element in CSS to style the placeholder text.',
    },
  },
};
export const FloatingLabel: Story = {
  render: InputFloatingLabel,
  parameters: {
    guide: {
      description: "Here's an example of how to build a floating label to the input.",
    },
  },
};
export const Mask: Story = {
  render: InputMask,
  parameters: guide(
    "Here's an example of formatting the input's value on each edit to mask its shape.",
  ),
};
export const CharacterCounter: Story = {
  render: InputCharacterCounter,
  parameters: guide("Here's an example of how to add a character counter to the input."),
};
export const CardNumber: Story = {
  render: InputCardNumber,
  parameters: guide("Here's an example of using `usePaymentInputs` to create a card number input."),
};
export const CardDetails: Story = {
  render: InputCardDetails,
  parameters: {
    guide: {
      heading: false,
      description: 'You can create a full card inputs for a card number, expiry date, and CVC.',
    },
  },
};
export const ClearButton: Story = {
  render: InputClearButton,
  parameters: guide(
    'Combine the `Input` and `CloseButton` components to create a clear button. This is useful for building search inputs.',
  ),
};
export const EndIcon: Story = { render: InputEndIcon };
export const EndText: Story = { render: InputEndText };
export const StartElementEndAddon: Story = { render: InputStartElementEndAddon };
export const SizeMatrix: Story = { render: InputSizeMatrix };
export const VariantMatrix: Story = { render: InputVariantMatrix };
