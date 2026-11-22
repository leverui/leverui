import type { Demo, DemoMeta } from './demo-types';
import './menu-examples.css';
import { withComponentInset } from './examples/example-frame';
import { MenuAnchorRect, MenuContextTrigger, MenuWithAvatar } from './examples/menu-anchors';
import { MenuHideWhenDetached, MenuOpenFromDialog } from './examples/menu-contexts';
import { OverlayMenuItem } from './examples/menu-dialog-nested';
import {
  MenuCommand,
  MenuDangerItem,
  MenuGroup,
  MenuGroupDynamic,
} from './examples/menu-item-layouts';
import { MenuIconAndCommand, MenuLinks } from './examples/menu-links';
import { MenuMixedLayout, MenuOverflow } from './examples/menu-mixed-overflow';
import { MenuSubmenu, MenuSubmenuDynamic } from './examples/menu-nesting';
import { MenuCheckboxItems, MenuRadioItems } from './examples/menu-selections';
import { MenuBasic, MenuControlled, MenuPlacement, MenuWithStore } from './examples/menu-state';
import { linksNote, openFromDialogNote, overflowNote } from './examples/menu-guide-notes';

export const meta = {
  component: MenuBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

interface GuideOptions {
  readonly after?: string;
}

/** Attach the description and any note shown after an example. */
function guide(description: string, options: GuideOptions = {}): Story['parameters'] {
  return {
    guide: {
      description,
      ...(options.after !== undefined && { after: options.after }),
    },
  };
}

export const Basic: Story = { render: MenuBasic };
export const Controlled: Story = {
  render: MenuControlled,
  parameters: guide(
    'Use the `open` and `onOpenChange` prop to control the visibility of the menu.',
  ),
};
export const WithStore: Story = {
  render: MenuWithStore,
  parameters: guide(
    'An alternative way to control the menu is to use the `RootProvider` component and the `useMenu` store hook.',
    { after: 'This way you can access the menu state and methods from outside the menu.' },
  ),
};
export const Command: Story = {
  render: MenuCommand,
  parameters: guide('Use the `Menu.ItemCommand` component to display a command in the menu.'),
};
export const ContextTrigger: Story = {
  render: MenuContextTrigger,
  parameters: guide('Use the `Menu.ContextTrigger` component to create a context menu.'),
};
export const Group: Story = {
  render: MenuGroup,
  parameters: guide('Use the `Menu.ItemGroup` component to group related menu items.'),
};
export const DangerItem: Story = {
  render: MenuDangerItem,
  parameters: guide(
    "Here's an example of how to style a menu item that is used to delete an item.",
  ),
};
export const Submenu: Story = {
  render: MenuSubmenu,
  parameters: guide("Here's an example of how to create a submenu."),
};
export const Links: Story = {
  render: MenuLinks,
  parameters: guide('Pass the `asChild` prop to the `Menu.Item` component to render a link.', {
    after: linksNote,
  }),
};
export const RadioItems: Story = {
  render: MenuRadioItems,
  parameters: guide("Here's an example of how to create a menu with radio items."),
};
export const CheckboxItems: Story = {
  render: MenuCheckboxItems,
  parameters: guide("Here's an example of how to create a menu with checkbox items."),
};
export const IconAndCommand: Story = {
  render: MenuIconAndCommand,
  parameters: guide('Compose the menu to include icons and commands.'),
};
export const Placement: Story = {
  render: MenuPlacement,
  parameters: guide('Use the `positioning.placement` prop to control the placement of the menu.'),
};
export const WithAvatar: Story = {
  render: MenuWithAvatar,
  parameters: guide(
    "Here's an example that composes the `Menu` with the `Avatar` component to display a menu underneath an avatar.",
  ),
};
export const AnchorRect: Story = {
  render: MenuAnchorRect,
  parameters: guide(
    'Use the `positioning.anchorPoint` prop to control the anchor point of the menu.',
    {
      after:
        'You can derive it from the `getBoundingClientRect` of a DOM element, or use something like `DOMRect.fromRect({ x: 0, y: 0, width: 1, height: 1 })` to create a new rect.',
    },
  ),
};
export const MixedLayout: Story = {
  render: MenuMixedLayout,
  parameters: guide(
    "Here's an example of how to create a mixed layout of menu items. In this layout, the top horizontal menu includes common menu items.",
  ),
};
export const Overflow: Story = {
  render: MenuOverflow,
  parameters: guide(
    'When you have a long list of menu items, you can set `max-height` with the `style` prop on the `Menu.Content` to create a scrollable menu.',
    { after: overflowNote },
  ),
};
export const HideWhenDetached: Story = {
  render: MenuHideWhenDetached,
  parameters: guide(
    'When the menu is rendered in an scrolling container, set the `positioning.hideWhenDetached` to `true` to hide the menu when the trigger is scrolled out of view.',
  ),
};
export const OpenFromDialog: Story = {
  render: MenuOpenFromDialog,
  parameters: guide(
    "To use the `Menu` within a `Dialog`, you need to avoid portalling the `Menu.Positioner` to the document's body.",
    { after: openFromDialogNote },
  ),
};
export const OpenFromDialogNested: Story = {
  render: OverlayMenuItem,
  parameters: {
    guide: {
      description:
        'When a `Menu` item opens a `Dialog` that contains another `Menu`, use `createOverlay` to avoid unexpected close behavior caused by event bubbling.',
    },
  },
};
export const GroupDynamic: Story = { render: MenuGroupDynamic };
export const SubmenuDynamic: Story = { render: MenuSubmenuDynamic };
