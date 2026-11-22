import type { Demo, DemoMeta } from './demo-types';
import { DrawerWithContext } from './examples/drawer-context';
import { DrawerWithCustomContainer } from './examples/drawer-custom-container';
import { DrawerWithHeaderActions } from './examples/drawer-header-actions';
import { DrawerWithInitialFocus } from './examples/drawer-initial-focus';
import {
  DrawerBasic,
  DrawerControlled,
  DrawerNonModal,
  DrawerWithOffset,
} from './examples/drawer-standard';
import {
  DrawerWithConditionalVariants,
  DrawerWithPlacement,
  DrawerWithSizes,
} from './examples/drawer-variants';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: DrawerBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description and any notes that follow the example. */
function guide(description: string, after?: string) {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

const initialFocusNote = `Without \`initialFocusEl\`, focus moves to the first element marked \`data-autofocus\`, falling back to the first tabbable element that is not marked \`data-no-autofocus\`.

\`\`\`tsx
<Input data-autofocus />
\`\`\``;

const containerNote =
  'Consider setting `closeOnInteractOutside` to `false` to prevent the drawer from closing when interacting outside the drawer.';

const conditionalNote = `This example uses the \`mdDown\` breakpoint to change the drawer's placement on smaller screens. This approach is recommended because both conditions are translated into CSS media queries, which helps avoid base style merging issues.

If you really want to use the base condition instead, you'll also need to define corresponding sizes. For example:
\`<Drawer.Root placement={{ base: 'bottom', md: 'end' }} size={{ base: 'xs', md: 'md' }}>\``;

const nonModalNote = `- set the \`modal\` prop to \`false\`
- set \`pointer-events\` to \`none\` on the \`Drawer.Positioner\` component
- (optional) set the \`closeOnInteractOutside\` prop to \`false\``;

export const Basic: Story = { render: DrawerBasic };
export const Controlled: Story = {
  render: DrawerControlled,
  parameters: guide('Use the `open` and `onOpenChange` props to control the drawer component.'),
};
export const Sizes: Story = {
  render: DrawerWithSizes,
  parameters: guide('Use the `size` prop to change the size of the drawer component.'),
};
export const Context: Story = {
  render: DrawerWithContext,
  parameters: guide(
    'Use the `Drawer.Context` component to access the drawer state and methods from outside the drawer.',
  ),
};
export const Offset: Story = {
  render: DrawerWithOffset,
  parameters: guide(
    'Use the `padding` CSS property on `Drawer.Positioner` to adjust the offset of the drawer component.',
  ),
};
export const Placement: Story = {
  render: DrawerWithPlacement,
  parameters: guide('Use the `placement` prop to change the placement of the drawer component.'),
};
export const InitialFocus: Story = {
  render: DrawerWithInitialFocus,
  parameters: guide(
    'Use the `initialFocusEl` prop to set the initial focus of the drawer component.',
    initialFocusNote,
  ),
};
export const CustomContainer: Story = {
  render: DrawerWithCustomContainer,
  parameters: guide(
    "Here's an example of how to render the drawer component in a custom container.",
    containerNote,
  ),
};
export const HeaderActions: Story = {
  render: DrawerWithHeaderActions,
  parameters: guide(
    "Here's an example of rendering actions in the header of the drawer component.",
  ),
};
export const ConditionalVariants: Story = {
  render: DrawerWithConditionalVariants,
  parameters: guide(
    'Here is an example of how to change variants based on the different breakpoints.',
    conditionalNote,
  ),
};
export const NonModal: Story = {
  render: DrawerNonModal,
  parameters: guide(
    "We don't recommend using a non-modal drawer due to the accessibility concerns they present. In event you need it, here's what you can do:",
    nonModalNote,
  ),
};
