import type { Demo, DemoMeta } from './demo-types';
import {
  ButtonAsLink,
  ButtonBasic,
  ButtonDisabled,
  ButtonDisabledLink,
  ButtonWithGroup,
  ButtonWithGroupFlushed,
  ButtonWithIconComposition,
  ButtonWithIcons,
} from './examples/button-basic';
import {
  ButtonWithCustomSpinner,
  ButtonWithLoading,
  ButtonWithLoadingToggle,
  ButtonWithSpinnerPlacement,
} from './examples/button-loading';
import { ButtonWithSplitMenu } from './examples/button-menu';
import {
  ButtonSizeTable,
  ButtonVariantTable,
  ButtonWithColors,
  ButtonWithRadius,
  ButtonWithResponsiveSize,
  ButtonWithStyleOverride,
} from './examples/button-variants';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ButtonBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: ButtonBasic,
};
export const Sizes: Story = {
  render: ButtonSizeTable,
  parameters: { guide: { description: 'Use the size prop to change the size of the button.' } },
};
export const Variants: Story = {
  render: ButtonVariantTable,
  parameters: {
    guide: { description: 'Use the variant prop to change the visual style of the Button.' },
  },
};
export const Icon: Story = {
  render: ButtonWithIcons,
  parameters: { guide: { description: 'Use icons within a button.' } },
};
export const Color: Story = {
  render: ButtonWithColors,
  parameters: {
    guide: { description: 'Use the colorPalette prop to change the color of the button.' },
  },
};
export const Disabled: Story = {
  render: ButtonDisabled,
  parameters: { guide: { description: 'Use the disabled prop to disable the button.' } },
};
export const DisabledLink: Story = {
  name: 'DisabledLink',
  render: ButtonDisabledLink,
  parameters: {
    guide: {
      description:
        'For a disabled link, prevent navigation and add aria-disabled and data-disabled.',
    },
  },
};
export const Group: Story = {
  render: ButtonWithGroup,
  parameters: { guide: { description: 'Share size and variant choices with ButtonGroup.' } },
};
export const GroupFlushed: Story = {
  name: 'GroupFlushed',
  render: ButtonWithGroupFlushed,
  parameters: { guide: { heading: false, description: 'Use attached to join the buttons.' } },
};
export const IconComposition: Story = {
  name: 'IconComposition',
  render: ButtonWithIconComposition,
};
export const Loading: Story = {
  render: ButtonWithLoading,
  parameters: {
    guide: { description: 'Use loading and loadingText while an action is in progress.' },
  },
};
export const LoadingToggle: Story = {
  name: 'LoadingToggle',
  render: ButtonWithLoadingToggle,
  parameters: {
    guide: {
      heading: false,
      description: 'Toggle loading while keeping the Button width steady.',
    },
  },
};
export const CustomSpinner: Story = {
  name: 'CustomSpinner',
  render: ButtonWithCustomSpinner,
  parameters: {
    guide: {
      description: 'Use spinner to change the loading indicator.',
    },
  },
};
export const SpinnerPlacement: Story = {
  name: 'SpinnerPlacement',
  render: ButtonWithSpinnerPlacement,
  parameters: { guide: { description: 'Use spinnerPlacement to move the spinner.' } },
};
export const SplitMenu: Story = {
  name: 'SplitMenu',
  render: ButtonWithSplitMenu,
  parameters: { guide: { description: 'Combine a Button and Menu in an attached Group.' } },
};
export const Radius: Story = {
  render: ButtonWithRadius,
  parameters: {
    guide: {
      description: 'Use public radius variables to change Button corners.',
    },
  },
};
export const ResponsiveSize: Story = {
  name: 'ResponsiveSize',
  render: ButtonWithResponsiveSize,
  parameters: {
    guide: {
      description: 'Pass breakpoint choices to size for a responsive Button.',
    },
  },
};
export const StyleOverrides: Story = {
  name: 'StyleOverrides',
  render: ButtonWithStyleOverride,
};
export const AsLink: Story = {
  name: 'AsLink',
  render: ButtonAsLink,
  parameters: { guide: { description: 'Use as="a" to render a semantic link.' } },
};
