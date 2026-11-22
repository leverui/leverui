import type { Demo, DemoMeta } from './demo-types';
import { EditableWithControls } from './examples/editable-controls';
import {
  EditableControlled,
  EditableWithFinalFocus,
  EditableWithStore,
} from './examples/editable-interactive';
import {
  EditableBasic,
  EditableDisabled,
  EditableWithDoubleClick,
  EditableWithTextarea,
} from './examples/editable-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: EditableBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the guide's description to one example. */
function guide(description: string) {
  return {
    guide: { description },
  };
}

export const Basic: Story = { render: EditableBasic };
export const DoubleClick: Story = {
  render: EditableWithDoubleClick,
  parameters: guide(
    'Use the `activationMode` prop to make the content editable when users double click.',
  ),
};
export const Disabled: Story = {
  render: EditableDisabled,
  parameters: guide('Use the `disabled` prop to disable the editable component.'),
};
export const Textarea: Story = {
  render: EditableWithTextarea,
  parameters: guide('You can make a text area editable.'),
};
export const Controls: Story = {
  render: EditableWithControls,
  parameters: guide(
    'Add controls such as "edit", "cancel" and "submit" to `Editable` for better user experience.',
  ),
};
export const Controlled: Story = {
  render: EditableControlled,
  parameters: guide('Use the `value` and `onValueChange` props to control the editable component.'),
};
export const Store: Story = {
  render: EditableWithStore,
  parameters: guide(
    'An alternative way to control the editable component is to use the `RootProvider` component and the `useEditable` store hook. This way you can access the editable state and methods from outside the editable.',
  ),
};
export const FinalFocus: Story = { render: EditableWithFinalFocus };
