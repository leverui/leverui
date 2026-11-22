import type { Demo, DemoMeta } from './demo-types';
import { FieldsetBasic } from './examples/fieldset-form';
import { FieldsetWithDisabled, FieldsetWithInvalid } from './examples/fieldset-shipping';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: FieldsetBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: FieldsetBasic,
};
export const Disabled: Story = {
  render: FieldsetWithDisabled,
  parameters: {
    guide: {
      description:
        'Use the `disabled` prop to disable the fieldset to disable all input elements within the fieldset.',
    },
  },
};
export const Invalid: Story = {
  render: FieldsetWithInvalid,
  parameters: {
    guide: {
      description:
        'Use the `invalid` prop to mark the fieldset as invalid. This will show the error text.',
      after:
        '> Note: You need to pass the `invalid` prop to the `Field` component within the fieldset to make each input element invalid.',
    },
  },
};
