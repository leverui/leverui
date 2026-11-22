import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { ComboboxSizesExample, ComboboxVariantsExample } from './examples/combobox-appearance';
import {
  ComboboxBasic,
  ComboboxMinCharacter,
  ComboboxOpenOnClick,
} from './examples/combobox-basic';
import { ComboboxControlled, ComboboxOpenControlled } from './examples/combobox-controlled';
import {
  ComboboxAutoHighlight,
  ComboboxPositioning,
  ComboboxWithCustomAnimation,
} from './examples/combobox-positioning';
import {
  ComboboxDisabled,
  ComboboxInvalid,
  ComboboxWithInputGroup,
} from './examples/combobox-states';
import { ComboboxCustomFilterExample } from './examples/combobox-custom-filter-example';
import { ComboboxCustomObjectExample } from './examples/combobox-custom-object-example';
import { ComboboxCustomItemExample } from './examples/combobox-custom-item-example';
import { ComboboxAsyncExample } from './examples/combobox-async-example';
import { ComboboxColorPickerExample } from './examples/combobox-color-picker-example';
import { ComboboxCreatableExample } from './examples/combobox-creatable-example';
import { ComboboxDisabledItemExample } from './examples/combobox-disabled-item-example';
import { ComboboxFieldExample } from './examples/combobox-field-example';
import { ComboboxFormSubmitExample } from './examples/combobox-form-submit-example';
import { ComboboxHighlightExample } from './examples/combobox-highlight-example';
import { ComboboxHookFormExample } from './examples/combobox-hook-form-example';
import { ComboboxInputInContentExample } from './examples/combobox-input-in-content-example';
import { ComboboxLinksExample } from './examples/combobox-links-example';
import { ComboboxLimitExample } from './examples/combobox-limit-example';
import { ComboboxMultipleExample } from './examples/combobox-multiple-example';
import { ComboboxOptionGroupExample } from './examples/combobox-option-group-example';
import { ComboboxPopoverExample } from './examples/combobox-popover-example';
import { ComboboxRehydrateExample } from './examples/combobox-rehydrate-example';
import { ComboboxSelectionBehaviorExample } from './examples/combobox-selection-behavior-example';
import { ComboboxStoreExample } from './examples/combobox-store-example';
import { ComboboxVirtualizedExample } from './examples/combobox-virtualized-example';
import { guide } from './combobox-guide-copy';

export const meta = {
  component: ComboboxBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { name: 'Basic', render: ComboboxBasic };
export const BasicExample: Story = {
  name: 'BasicExample',
  render: ComboboxBasic,
  parameters: guide.basic,
};
export const Sizes: Story = {
  name: 'Sizes',
  render: ComboboxSizesExample,
  parameters: guide.sizes,
};
export const Variants: Story = {
  name: 'Variants',
  render: ComboboxVariantsExample,
  parameters: guide.variants,
};
export const Multiple: Story = {
  render: ComboboxMultipleExample,
  parameters: guide.multiple,
};
export const Async: Story = {
  name: 'Async',
  render: ComboboxAsyncExample,
  parameters: guide.async,
};
export const Highlight: Story = {
  name: 'Highlight',
  render: ComboboxHighlightExample,
  parameters: guide.highlight,
};
export const OpenOnClick: Story = {
  name: 'OpenOnClick',
  render: ComboboxOpenOnClick,
  parameters: guide.openOnClick,
};
export const CustomObject: Story = {
  name: 'CustomObject',
  render: ComboboxCustomObjectExample,
  parameters: guide.customObject,
};
export const MinCharacter: Story = {
  name: 'MinCharacter',
  render: ComboboxMinCharacter,
  parameters: guide.minCharacter,
};
export const Field: Story = {
  name: 'Field',
  render: ComboboxFieldExample,
  parameters: guide.field,
};
export const FormSubmit: Story = {
  name: 'FormSubmit',
  render: ComboboxFormSubmitExample,
  parameters: guide.formSubmit,
};
export const HookForm: Story = {
  name: 'HookForm',
  render: ComboboxHookFormExample,
  parameters: guide.hookForm,
};
export const Disabled: Story = {
  render: ComboboxDisabled,
  parameters: guide.disabled,
};
export const DisabledItem: Story = {
  name: 'DisabledItem',
  render: ComboboxDisabledItemExample,
  parameters: guide.disabledItem,
};
export const InputGroup: Story = {
  name: 'InputGroup',
  render: ComboboxWithInputGroup,
  parameters: guide.inputGroup,
};
export const Invalid: Story = {
  name: 'Invalid',
  render: ComboboxInvalid,
  parameters: guide.invalid,
};
export const Controlled: Story = {
  render: ComboboxControlled,
  parameters: guide.controlled,
};
export const Store: Story = {
  name: 'Store',
  render: ComboboxStoreExample,
  parameters: guide.store,
};
export const OpenControlled: Story = {
  name: 'OpenControlled',
  render: ComboboxOpenControlled,
  parameters: guide.openControlled,
};
export const Limit: Story = {
  name: 'Limit',
  render: ComboboxLimitExample,
  parameters: guide.limit,
};
export const Virtualized: Story = {
  name: 'Virtualized',
  render: ComboboxVirtualizedExample,
  parameters: guide.virtualized,
};
export const Links: Story = {
  name: 'Links',
  render: ComboboxLinksExample,
  parameters: guide.links,
};
export const RehydrateValue: Story = {
  name: 'RehydrateValue',
  render: ComboboxRehydrateExample,
  parameters: guide.rehydrate,
};
export const CustomItem: Story = {
  name: 'CustomItem',
  render: ComboboxCustomItemExample,
  parameters: guide.customItem,
};
export const CustomFilter: Story = {
  name: 'CustomFilter',
  render: ComboboxCustomFilterExample,
  parameters: guide.customFilter,
};
export const CustomAnimation: Story = {
  name: 'CustomAnimation',
  render: ComboboxWithCustomAnimation,
  parameters: guide.customAnimation,
};
export const OpenFromPopover: Story = {
  name: 'OpenFromPopover',
  render: ComboboxPopoverExample,
  parameters: guide.openFromPopover,
};
export const Createable: Story = {
  name: 'Createable',
  render: ComboboxCreatableExample,
  parameters: guide.creatable,
};
export const AutoHighlight: Story = { render: ComboboxAutoHighlight };
export const OptionGroup: Story = { render: ComboboxOptionGroupExample };
export const Positioning: Story = { render: ComboboxPositioning };
export const InputInContent: Story = {
  render: ComboboxInputInContentExample,
};
export const SelectionBehavior: Story = {
  render: ComboboxSelectionBehaviorExample,
};
export const ColorPicker: Story = { render: ComboboxColorPickerExample };
