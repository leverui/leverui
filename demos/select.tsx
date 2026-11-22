import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { SelectAsyncLoading } from './examples/select-async';
import { SelectBasic, SelectControlled, SelectMultiple } from './examples/select-basic-examples';
import { SelectHookForm, SelectNativeForm } from './examples/select-forms';
import { SelectIconButton } from './examples/select-icon-button';
import {
  SelectColorPalette,
  SelectPositioning,
  SelectSizes,
  SelectVariants,
} from './examples/select-matrices';
import { SelectClear, SelectOverflow } from './examples/select-overflow';
import { SelectOpenFromDialog, SelectOpenFromPopover } from './examples/select-overlays';
import { selectDialogGuide } from './examples/select-guide-text';
import { SelectAvatar, SelectCountry } from './examples/select-rich-members';
import { SelectDisabled, SelectDisabledOption, SelectInvalid } from './examples/select-states';
import { SelectItemDescription, SelectOptionGroup } from './examples/select-rich-options';
import { SelectVirtualized } from './examples/select-virtualized-example';

export const meta = {
  component: SelectBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: SelectBasic };
export const Sizes: Story = {
  render: SelectSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to change the size of the select component.' },
  },
};
export const Variants: Story = {
  render: SelectVariants,
  parameters: {
    guide: {
      description: 'Use the `variant` prop to change the appearance of the select component.',
    },
  },
};
export const ColorPalette: Story = {
  render: SelectColorPalette,
  parameters: {
    guide: {
      description:
        'The Select component is designed to be neutral-colored by default for consistency across form elements. To apply a color palette, style the trigger and indicator components directly using the `colorPalette` token.',
    },
  },
};
export const OptionGroup: Story = {
  render: SelectOptionGroup,
  parameters: {
    guide: { description: 'Use the `Select.ItemGroup` component to group select options.' },
  },
};
export const Controlled: Story = {
  render: SelectControlled,
  parameters: {
    guide: {
      description: 'Use the `value` and `onValueChange` props to control the select component.',
    },
  },
};
export const AsyncLoading: Story = {
  render: SelectAsyncLoading,
  parameters: {
    guide: {
      description:
        "Here's an example of how to populate the select `collection` from a remote source.",
    },
  },
};
export const HookForm: Story = {
  render: SelectHookForm,
  parameters: {
    guide: {
      description:
        "Here's an example of how to use the `Select` component in a form with a Solid signal holding its value.",
    },
  },
};
export const Disabled: Story = {
  render: SelectDisabled,
  parameters: {
    guide: { description: 'Use the `disabled` prop to disable the select component.' },
  },
};
export const Invalid: Story = {
  render: SelectInvalid,
  parameters: {
    guide: {
      description:
        "Here's an example of how to compose the `Select` component with the `Field` component to display an error state.",
    },
  },
};
export const Multiple: Story = {
  render: SelectMultiple,
  parameters: { guide: { description: 'Use the `multiple` prop to allow multiple selections.' } },
};
export const Positioning: Story = {
  render: SelectPositioning,
  parameters: {
    guide: {
      description:
        'Use the `positioning` prop to control the underlying `floating-ui` options of the select component.',
    },
  },
};
export const Clear: Story = {
  render: SelectClear,
  parameters: {
    guide: {
      description:
        'Render the `Select.ClearTrigger` component to show a clear button. Clicking the clear button will clear the selected value.',
    },
  },
};
export const Overflow: Story = {
  render: SelectOverflow,
  parameters: {
    guide: {
      description:
        'When the options are too many, the options will overflow the container due to the `maxHeight` set.',
    },
  },
};
export const Virtualized: Story = {
  render: SelectVirtualized,
  parameters: {
    guide: {
      description:
        'For large collections, combine the Select with TanStack Virtual to render only the visible items and keep scrolling responsive. Its Solid adapter targets Solid 1, so the example uses a small Solid 2 binding over `@tanstack/virtual-core`.',
    },
  },
};
export const ItemDescription: Story = {
  render: SelectItemDescription,
  parameters: {
    guide: { description: "Here's an example of how to render a description for each item." },
  },
};
export const OpenFromPopover: Story = {
  render: SelectOpenFromPopover,
  parameters: {
    guide: {
      description: "Here's an example of how to use the `Select` within a `Popover` component.",
    },
  },
};
export const OpenFromDialog: Story = {
  render: SelectOpenFromDialog,
  parameters: { guide: selectDialogGuide },
};
export const Avatar: Story = {
  render: SelectAvatar,
  parameters: {
    guide: { description: "Here's an example of how to compose the `Select` and the `Avatar`." },
  },
};
export const Country: Story = {
  render: SelectCountry,
  parameters: {
    guide: {
      description: "Here's an example of how to use the `Select` component to select a country.",
    },
  },
};
export const IconButton: Story = {
  render: SelectIconButton,
  parameters: {
    guide: {
      description: "Here's an example of how to trigger the select component with an `IconButton`.",
    },
  },
};
export const DisabledOption: Story = { render: SelectDisabledOption };
export const NativeForm: Story = { render: SelectNativeForm };
