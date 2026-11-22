import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { NativeSelectWithHookForm } from './examples/native-select-form';
import { NativeSelectWithInputGroup } from './examples/native-select-input-group';
import { NativeSelectWithSizes, NativeSelectWithVariants } from './examples/native-select-matrices';
import {
  NativeSelectBasic,
  NativeSelectControlled,
  NativeSelectWithDisabled,
  NativeSelectWithInvalid,
  NativeSelectWithInvalidRoot,
} from './examples/native-select-standard';

export const meta = {
  component: NativeSelectBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: NativeSelectBasic };
export const Sizes: Story = {
  render: NativeSelectWithSizes,
  parameters: guide('Use the `size` prop to change the size of the select component.'),
};
export const Variants: Story = {
  render: NativeSelectWithVariants,
  parameters: guide('Use the `variant` prop to change the appearance of the select component.'),
};
export const Controlled: Story = {
  render: NativeSelectControlled,
  parameters: guide('Use the `value` and `onChange` props to control the select component.'),
};
export const Disabled: Story = {
  render: NativeSelectWithDisabled,
  parameters: guide(
    'Pass the `disabled` prop to the `NativeSelect.Root` component to disable the select component.',
  ),
};
export const Invalid: Story = {
  render: NativeSelectWithInvalid,
  parameters: guide(
    'Compose the native and `Field` component to set the invalid set and show the error text.',
  ),
};
export const InvalidRoot: Story = {
  render: NativeSelectWithInvalidRoot,
  parameters: {
    guide: {
      heading: false,
      description:
        'Alternatively, you can use the `invalid` prop on the `NativeSelect.Root` component as well.',
    },
  },
};
export const HookForm: Story = {
  render: NativeSelectWithHookForm,
  parameters: guide(
    'Here is an example of how to use the `NativeSelect` component with Solid form state.',
  ),
};
export const InputGroup: Story = { render: NativeSelectWithInputGroup };
