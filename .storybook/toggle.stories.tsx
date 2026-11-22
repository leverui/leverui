import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, Toggle } from '../src';
import { ToggleGuideIcon } from './toggle-guide-icon';
import '../demos/toggle-button.css';

/** Exercise a controlled Toggle through a styled child button and native form. */
function ToggleContractExample(): JSX.Element {
  const [pressed, setPressed] = createSignal(false);

  /** Keep the consumer's state synchronized with Zag. */
  function handlePressedChange(value: boolean): void {
    setPressed(value);
  }

  return (
    <>
      <form data-testid="toggle-form" style={{ padding: '24px' }}>
        <Toggle.Root
          pressed={pressed()}
          onPressedChange={handlePressedChange}
          aria-label="Bold"
          class="toggle-consumer"
          data-testid="toggle-root"
          asChild={
            /** Keep the primitive button behavior on the Lever UI Button. */
            (getProps) => (
              <Button
                {...getProps({ class: 'toggle-example-blue' })}
                variant="subtle"
                colorPalette="blue"
              >
                <Toggle.Indicator fallback="Bold off">Bold on</Toggle.Indicator>
                <Toggle.Context>
                  {
                    /** Expose the same machine state through the public context. */
                    (api) => (
                      <output data-testid="toggle-context">{api().pressed ? 'on' : 'off'}</output>
                    )
                  }
                </Toggle.Context>
              </Button>
            )
          }
        />
        <output data-testid="toggle-value">{pressed() ? 'on' : 'off'}</output>
      </form>
    </>
  );
}

/** Show disabled behavior, default state, and reactive provider defaults. */
function ToggleStatesExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);

  /** Toggle inherited disabled state without replacing the root. */
  function changeDefaults(): void {
    setDisabled(!disabled());
  }

  /** Read the current defaults inside the provider. */
  function readDefaults(): { disabled: boolean } {
    return { disabled: disabled() };
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <Toggle.Root disabled defaultPressed aria-label="Disabled Toggle">
          Disabled
        </Toggle.Root>
        <Toggle.Root defaultPressed aria-label="Initially pressed Toggle">
          <Toggle.Indicator data-testid="toggle-empty-indicator" />
          Pressed
        </Toggle.Root>
        <Toggle.PropsProvider value={readDefaults}>
          <Toggle.Root aria-label="Inherited Toggle" data-testid="toggle-inherited-root">
            Inherited
          </Toggle.Root>
        </Toggle.PropsProvider>
        <button type="button" onClick={changeDefaults} data-testid="toggle-defaults">
          Change defaults
        </button>
      </div>
    </>
  );
}

/** Show an icon only while the child Button is pressed. */
function TogglePressedIconExample(): JSX.Element {
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Toggle.Root
          defaultPressed
          asChild={
            /** Preserve one interactive button and its pressed state. */
            (getProps) => (
              <Button
                {...getProps({ class: 'toggle-example-red' })}
                variant="outline"
                colorPalette="gray"
              >
                <Toggle.Indicator data-testid="pressed-icon">
                  <ToggleGuideIcon name="x" />
                </Toggle.Indicator>
                Declined
              </Button>
            )
          }
        />
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Toggle',
  component: ToggleContractExample,
} satisfies Meta<typeof ToggleContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: ToggleContractExample };
export const States: Story = { render: ToggleStatesExample };
export const PressedIcon: Story = { render: TogglePressedIconExample };
