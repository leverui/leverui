import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  TextareaWithErrorText,
  TextareaWithField,
  TextareaWithHelperText,
  TextareaWithInputField,
} from './examples/textarea-fields';
import { TextareaWithForm, TextareaWithHookForm } from './examples/textarea-forms';
import {
  TextareaBasic,
  TextareaWithAutoresize,
  TextareaWithAutoresizeMaxRows,
  TextareaWithResize,
  TextareaWithSizes,
  TextareaWithVariants,
} from './examples/textarea-standard';
import { TextareaSizeTable, TextareaVariantTable } from './examples/textarea-tables';

export const meta = {
  component: TextareaBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: TextareaBasic };
export const Variants: Story = {
  render: TextareaWithVariants,
  parameters: {
    guide: { description: 'Use the `variant` prop to change the appearance of the textarea.' },
  },
};
export const Sizes: Story = {
  render: TextareaWithSizes,
  parameters: { guide: { description: 'Use the `size` prop to change the size of the textarea.' } },
};
export const SizeMatrix: Story = { render: TextareaSizeTable };
export const VariantMatrix: Story = { render: TextareaVariantTable };
export const HelperText: Story = {
  render: TextareaWithHelperText,
  parameters: {
    guide: {
      description: 'Pair the textarea with the `Field` component to add helper text.',
    },
  },
};
export const ErrorText: Story = {
  render: TextareaWithErrorText,
  parameters: {
    guide: {
      description: 'Pair the textarea with the `Field` component to add error text.',
    },
  },
};
export const Field: Story = {
  render: TextareaWithInputField,
  parameters: {
    guide: {
      description:
        'Compose the textarea with the `Field` component to add a label, helper text, and error text.',
    },
  },
};
export const TextareaField: Story = { render: TextareaWithField };
export const HookForm: Story = {
  render: TextareaWithHookForm,
  parameters: {
    guide: {
      description:
        "Here's an example of how to integrate the textarea with a native Solid form submission.",
    },
  },
};
export const Resize: Story = {
  render: TextareaWithResize,
  parameters: {
    guide: {
      description:
        'Use the `style` prop with a `resize` value to control the resize behavior of the textarea.',
      after: [
        'To limit the maximum height (or rows) of the textarea, we recommend using the `style` prop with `max-height` and setting the value to a `lh` unit.',
        '',
        '```tsx',
        "<Textarea autoresize style={{ 'max-height': '5lh' }} />",
        '```',
      ].join('\n'),
    },
  },
};
export const Autoresize: Story = {
  render: TextareaWithAutoresize,
  parameters: {
    guide: {
      description:
        'Use the `autoresize` prop to make the textarea autoresize vertically as you type.',
    },
  },
};
export const AutoresizeMaxRows: Story = { render: TextareaWithAutoresizeMaxRows };
export const Form: Story = { render: TextareaWithForm };
