import type { Demo, DemoMeta } from './demo-types';
import './examples/accordion.css';
import { withComponentInset } from './examples/example-frame';
import { AccordionWithActions, AccordionWithSubtext } from './examples/accordion-actions';
import { AccordionWithAvatar } from './examples/accordion-avatar';
import { AccordionWithExpandedStyle } from './examples/accordion-expanded-style';
import { AccordionExplorerDemo, AccordionWithIcon } from './examples/accordion-rich';
import {
  AccordionBasic,
  AccordionControlled,
  AccordionWithDisabledItem,
  AccordionWithMultiple,
} from './examples/accordion-standard';
import { AccordionSizeTable, AccordionVariantTable } from './examples/accordion-tables';

export const meta = {
  component: AccordionBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: AccordionBasic,
};
export const Controlled: Story = {
  render: AccordionControlled,
  parameters: { guide: { description: 'Set the accordion that shows up by default.' } },
};
export const Sizes: Story = {
  render: AccordionSizeTable,
  parameters: {
    guide: {
      description: 'Use the `size` prop to change the size of the accordion.',
    },
  },
};
export const Variants: Story = {
  render: AccordionVariantTable,
  parameters: {
    guide: {
      description:
        'Use the `variant` prop to change the visual style of the accordion. Values can be either `outline`, `subtle`, `enclosed` or `plain`.',
    },
  },
};
export const Actions: Story = {
  render: AccordionWithActions,
  parameters: {
    guide: {
      description: "Here's an example of adding actions to an accordion item trigger.",
    },
  },
};
export const Avatar: Story = {
  render: AccordionWithAvatar,
  parameters: {
    guide: {
      description: "Here's an example of composing an accordion with an avatar.",
    },
  },
};
export const DisabledItem: Story = {
  render: AccordionWithDisabledItem,
  parameters: {
    guide: {
      description:
        'Pass the `disabled` prop to any `Accordion.Item` to prevent it from being expanded or collapsed.',
    },
  },
};
export const ExpandedStyle: Story = {
  render: AccordionWithExpandedStyle,
  parameters: {
    guide: {
      description:
        "Use the `data-state='open'` selector on an `Accordion.ItemTrigger` or `Accordion.Item` to style it when expanded.",
    },
  },
};
export const Icon: Story = {
  render: AccordionWithIcon,
  parameters: {
    guide: {
      description: "Here's an example of rendering a custom icon in each accordion item.",
    },
  },
};
export const Multiple: Story = {
  render: AccordionWithMultiple,
  parameters: {
    guide: {
      description: 'Use the `multiple` prop to allow multiple items to be expanded at once.',
    },
  },
};
export const Subtext: Story = {
  render: AccordionWithSubtext,
  parameters: {
    guide: {
      description: "Here's an example of adding a subtext to an accordion item.",
    },
  },
};
export const Explorer: Story = {
  render: AccordionExplorerDemo,
};
