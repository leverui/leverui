import type { Demo, DemoMeta } from './demo-types';
import './tags-input-examples.css';
import {
  TagsInputBasic,
  TagsInputControlled,
  TagsInputEditable,
  TagsInputExplorer,
} from './examples/tags-input-basic';
import {
  TagsInputDisabled,
  TagsInputField,
  TagsInputInvalid,
  TagsInputReadOnly,
} from './examples/tags-input-states';
import {
  TagsInputBlurBehavior,
  TagsInputClear,
  TagsInputDelimiter,
  TagsInputMax,
  TagsInputSanitizedValue,
  TagsInputValidation,
} from './examples/tags-input-behavior';
import {
  TagsInputColors,
  TagsInputLongTags,
  TagsInputSizes,
  TagsInputVariants,
} from './examples/tags-input-display';
import { withComponentInset } from './examples/example-frame';
import {
  TagsInputCombobox,
  TagsInputForm,
  TagsInputPaste,
  TagsInputStore,
} from './examples/tags-input-integrations';

export const meta = {
  component: TagsInputBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a description and optional following Markdown. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: TagsInputBasic };
export const Sizes: Story = {
  render: TagsInputSizes,
  parameters: guide('Use the `size` prop to adjust the size of the tags input.'),
};
export const Variants: Story = {
  render: TagsInputVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the tags input.'),
};
export const Controlled: Story = {
  render: TagsInputControlled,
  parameters: guide(
    'Use the `value` and `onValueChange` props to programmatically control the tags.',
  ),
};
export const Store: Story = {
  render: TagsInputStore,
  parameters: guide(
    'An alternative way to control the tags input is to use the `RootProvider` component and the `useTagsInput` store function. This way you can access the tags input state and methods from outside the component.',
    '> Use `RootProvider + useTagsInput` or `Root`, not both.',
  ),
};
export const Max: Story = {
  render: TagsInputMax,
  parameters: guide(
    'Pass the `max` prop to the `TagsInput.Root` component to limit the number of tags that can be added.',
  ),
};
export const Editable: Story = {
  render: TagsInputEditable,
  parameters: guide(
    'Use the `editable` prop to enable inline editing of existing tags by double clicking or pressing `Enter` when highlighted, allowing users to quickly update tag values.',
  ),
};
export const Validation: Story = {
  render: TagsInputValidation,
  parameters: guide(
    'Use the `validate` prop to implement custom validation rules. Tags will be added when the validation passes.',
  ),
};
export const Disabled: Story = {
  render: TagsInputDisabled,
  parameters: guide(
    'Use the `disabled` prop to disable the tags input to prevent user interaction.',
  ),
};
export const ReadOnly: Story = {
  render: TagsInputReadOnly,
  parameters: guide(
    "Use the `readOnly` prop to make the tags input read-only. Tags input can be focused but can't be modified.",
  ),
};
export const Invalid: Story = {
  render: TagsInputInvalid,
  parameters: guide(
    'Pass the `invalid` prop to the `TagsInput.Root` component to display the tags input in an invalid state with error messages.',
  ),
};
export const Field: Story = {
  render: TagsInputField,
  parameters: guide(
    "Here's an example that composes the `TagsInput.Root` with the `Field` component to add labels, helper text, and error messages.",
  ),
};
export const Form: Story = {
  render: TagsInputForm,
  parameters: guide(
    "Here's an example that composes the `TagsInput.Root` with a `form` to collect structured data and handle submissions.",
  ),
};
export const Paste: Story = {
  render: TagsInputPaste,
  parameters: guide(
    'Pass the `addOnPaste` prop to the `TagsInput.Root` component to allow users to paste multiple values at once, automatically splitting them into individual tags based on a delimiter.',
  ),
};
export const SanitizedValue: Story = {
  render: TagsInputSanitizedValue,
  parameters: guide(
    'Use the `sanitizeValue` prop to normalize a value before it is added, such as trimming whitespace or converting text to lowercase.',
  ),
};
export const BlurBehavior: Story = {
  render: TagsInputBlurBehavior,
  parameters: guide(
    'Use the `blurBehavior` prop to configure how the input behaves when it loses focus, such as automatically creating a tag from the current input value.',
  ),
};
export const Delimiter: Story = {
  render: TagsInputDelimiter,
  parameters: guide(
    'Use the `delimiter` prop to use custom delimiters like commas, semicolons, or spaces to create new tags as users type.',
  ),
};
export const Colors: Story = {
  render: TagsInputColors,
  parameters: {
    guide: {
      description:
        "Here's an example that assigns rather color scheme to the tags based on the tag value.",
    },
  },
};
export const Combobox: Story = {
  render: TagsInputCombobox,
  parameters: guide(
    "Here's an example that composes the `TagsInput` component with the `Combobox` component to create a tags input that allows users to select from a list of predefined tags.",
  ),
};
export const Clear: Story = { render: TagsInputClear };
export const LongTags: Story = { render: TagsInputLongTags };
export const _Explorer: Story = { render: TagsInputExplorer };
