import type { Demo, DemoMeta } from './demo-types';
import { AlertSizeTable, AlertVariantTable } from './examples/alert-tables';
import { withComponentInset } from './examples/example-frame';
import { AlertWithCustomIcon, AlertWithCustomization } from './examples/alert-rich';
import {
  AlertBasic,
  AlertWithButtons,
  AlertWithCloseButton,
  AlertWithColorPaletteOverride,
  AlertWithDescription,
  AlertExplorerDemo,
  AlertWithSpinner,
  AlertWithStatus,
  AlertWithVariants,
} from './examples/alert-standard';

export const meta = {
  component: AlertBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: AlertBasic,
};
export const Sizes: Story = { render: AlertSizeTable };
export const Variants: Story = {
  render: AlertWithVariants,
  parameters: {
    guide: {
      description:
        'Use `variant` to change the visual style of the alert: `subtle`, `solid`, `outline`, or `surface`.',
    },
  },
};
export const VariantMatrix: Story = { render: AlertVariantTable };
export const Buttons: Story = { render: AlertWithButtons };
export const CloseButton: Story = {
  render: AlertWithCloseButton,
  parameters: {
    guide: {
      description: "Here's an example of composing the `Alert` with a close button.",
    },
  },
};
export const ColorPaletteOverride: Story = {
  render: AlertWithColorPaletteOverride,
  parameters: {
    guide: {
      description:
        'The default `colorPalette` is inferred from `status`. Pass `colorPalette` to override it.',
    },
  },
};
export const CustomIcon: Story = {
  render: AlertWithCustomIcon,
  parameters: {
    guide: {
      description: 'Pass a child to `Alert.Indicator` to override the default status icon.',
    },
  },
};
export const Customization: Story = {
  render: AlertWithCustomization,
  parameters: {
    guide: {
      description: 'Style the `Alert` parts with authored CSS classes and variables.',
    },
  },
};
export const Description: Story = {
  render: AlertWithDescription,
  parameters: {
    guide: {
      description: 'Render `Alert.Description` to provide additional context to the alert.',
    },
  },
};
export const Spinner: Story = {
  render: AlertWithSpinner,
  parameters: {
    guide: {
      description: "Here's an example of composing the `Alert` with a spinner.",
    },
  },
};
export const Status: Story = {
  render: AlertWithStatus,
  parameters: {
    guide: {
      description:
        'Set `status` to `error`, `success`, `warning`, or `info` to change the palette and indicator.',
    },
  },
};
export const Explorer: Story = { render: AlertExplorerDemo };
