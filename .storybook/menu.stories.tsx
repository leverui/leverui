import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  MenuArrow,
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  Portal,
  type MenuSelectionDetails,
} from '../src';

/** Exercise the public menu parts, selection, disabling, and slot styling. */
function MenuExample(): JSX.Element {
  const [selected, setSelected] = createSignal('none');

  /** Show the current primitive selection in the browser specimen. */
  function updateSelected(details: MenuSelectionDetails): void {
    setSelected(details.value);
  }

  return (
    <>
      <MenuRoot onSelect={updateSelected}>
        <MenuTrigger data-testid="menu-trigger">Open menu</MenuTrigger>
        <Portal>
          <MenuPositioner data-testid="menu-positioner">
            <MenuContent
              data-testid="menu-content"
              ref={
                /** Expose native ref forwarding through the focus repair. */
                (element) => element.setAttribute('data-ref-seen', 'true')
              }
            >
              <MenuArrow data-testid="menu-arrow" />
              <MenuItemGroup>
                <MenuItemGroupLabel>Actions</MenuItemGroupLabel>
                <MenuItem value="rename" data-testid="menu-rename">
                  <MenuItemText>Rename</MenuItemText>
                  <MenuItemCommand>⌘R</MenuItemCommand>
                </MenuItem>
                <MenuItem value="archive" disabled data-testid="menu-archive">
                  Archive
                </MenuItem>
              </MenuItemGroup>
              <MenuSeparator data-testid="menu-separator" />
              <MenuItem value="delete" data-testid="menu-delete">
                Delete
              </MenuItem>
              <MenuItem as="a" href="#menu-destination" value="help" data-testid="menu-help">
                Help
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
      <output data-testid="menu-selected">{selected()}</output>
    </>
  );
}

/** Exercise non-default floating placement and pointer dismissal in a viewport. */
function PlacementMenu(): JSX.Element {
  return (
    <>
      <div style={{ padding: '220px' }}>
        <MenuRoot positioning={{ placement: 'left-start' }}>
          <MenuTrigger data-testid="menu-placement-trigger">Open placed menu</MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent data-testid="menu-placement-content">
                <MenuItem value="placed">Placed item</MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>
        <button
          type="button"
          data-testid="menu-outside-target"
          style={{ position: 'absolute', right: '16px', bottom: '16px' }}
        >
          Outside target
        </button>
      </div>
    </>
  );
}

/** Verify focus repair and both refs on a caller-owned content element. */
function MenuAsChild(): JSX.Element {
  /** Mark the public part ref on the rendered native node. */
  function captureParent(element: Element): void {
    element.setAttribute('data-parent-ref', 'true');
  }

  /** Mark the caller-owned child ref on the same node. */
  function captureChild(element: Element): void {
    element.setAttribute('data-child-ref', 'true');
  }

  return (
    <>
      <MenuRoot>
        <MenuTrigger data-testid="menu-child-trigger">Open child menu</MenuTrigger>
        <MenuPositioner>
          <MenuContent
            ref={captureParent}
            asChild={
              /** Render the menu on the caller's native section. */
              (getProps) => (
                <section {...getProps({ ref: captureChild })} data-testid="menu-child-content" />
              )
            }
          >
            <MenuItem value="child">Child item</MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    </>
  );
}

/** Exercise a caller-owned accessible label without changing Escape focus. */
function MenuWithCustomLabel(): JSX.Element {
  return (
    <>
      <span id="menu-custom-label" tabindex={-1} data-testid="menu-custom-label">
        Labeled actions
      </span>
      <MenuRoot>
        <MenuTrigger data-testid="menu-labeled-trigger">Open labeled menu</MenuTrigger>
        <MenuPositioner>
          <MenuContent aria-labelledby="menu-custom-label" data-testid="menu-labeled-content">
            <MenuItem value="labeled">Labeled item</MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    </>
  );
}

const meta = {
  title: 'Components/Menu',
  component: MenuExample,
} satisfies Meta<typeof MenuExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};

export const Placement: Story = { render: PlacementMenu };

export const AsChild: Story = { render: MenuAsChild };

export const CustomLabel: Story = { render: MenuWithCustomLabel };
