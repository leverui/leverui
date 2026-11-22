import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItemIndicator,
  MenuItemText,
  MenuPositioner,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuTrigger,
  Portal,
  type MenuValueChangeDetails,
} from '../src';

/** Exercise checkbox and radio items through their public state callbacks. */
function MenuOptionsExample(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  const [choice, setChoice] = createSignal('alpha');

  /** Keep the checkbox controlled after the primitive toggles it. */
  function updateChecked(checked: boolean): void {
    setChecked(checked);
  }

  /** Keep the radio group controlled after the primitive selects a value. */
  function updateChoice(details: MenuValueChangeDetails): void {
    setChoice(details.value);
  }

  return (
    <>
      <MenuRoot closeOnSelect={false}>
        <MenuTrigger data-testid="menu-options-trigger">Options</MenuTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent data-testid="menu-options-content">
              <MenuCheckboxItem
                value="alerts"
                checked={checked()}
                onCheckedChange={updateChecked}
                data-testid="menu-checkbox"
              >
                <MenuItemIndicator data-testid="menu-checkbox-indicator" />
                <MenuItemText>Alerts</MenuItemText>
              </MenuCheckboxItem>
              <MenuRadioItemGroup value={choice()} onValueChange={updateChoice}>
                <MenuRadioItem value="alpha" data-testid="menu-radio-alpha">
                  <MenuItemIndicator />
                  <MenuItemText>Alpha</MenuItemText>
                </MenuRadioItem>
                <MenuRadioItem value="beta" data-testid="menu-radio-beta">
                  <MenuItemIndicator />
                  <MenuItemText>Beta</MenuItemText>
                </MenuRadioItem>
              </MenuRadioItemGroup>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
      <output data-testid="menu-checked">{String(checked())}</output>
      <output data-testid="menu-choice">{choice()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Menu Options',
  component: MenuOptionsExample,
} satisfies Meta<typeof MenuOptionsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
