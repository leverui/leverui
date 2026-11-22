import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Switch } from '../src';

/** Exercise external controlled updates, form reset, and provider defaults. */
function SwitchStateContract(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('lg');
  const external = Switch.useSwitch({ defaultChecked: false });

  /** Keep the controlled machine synchronized with its owning signal. */
  function handleCheckedChange(details: { checked: boolean }): void {
    setChecked(details.checked);
  }

  /** Update checked state without a native input event. */
  function toggleControlledState(): void {
    setChecked(!checked());
  }

  /** Change inherited appearance without replacing either Switch machine. */
  function toggleProviderSize(): void {
    setSize(size() === 'lg' ? 'sm' : 'lg');
  }

  /** Follow the current provider variant values. */
  function readRecipeDefaults(): { size: 'sm' | 'lg'; variant: 'raised' } {
    return { size: size(), variant: 'raised' };
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <form data-testid="controlled-switch-form">
          <Switch.Root
            name="controlled-notifications"
            value="yes"
            checked={checked()}
            onCheckedChange={handleCheckedChange}
            data-testid="controlled-switch-root"
          >
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Controlled updates</Switch.Label>
          </Switch.Root>
        </form>
        <button
          type="button"
          onClick={toggleControlledState}
          data-testid="controlled-switch-toggle"
        >
          Toggle controlled state
        </button>
        <form data-testid="reset-switch-form">
          <Switch.Root name="reset-notifications" value="yes" defaultChecked>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Resettable</Switch.Label>
          </Switch.Root>
          <button type="reset" data-testid="reset-switch-button">
            Reset form
          </button>
        </form>
        <Switch.PropsProvider value={readRecipeDefaults}>
          <Switch.Root data-testid="inherited-switch-root">
            <Switch.HiddenInput />
            <Switch.Control data-testid="inherited-switch-control" />
            <Switch.Label>Inherited root</Switch.Label>
          </Switch.Root>
          <Switch.RootProvider value={external} data-testid="inherited-provider-root">
            <Switch.HiddenInput />
            <Switch.Control data-testid="inherited-provider-control" />
            <Switch.Label>Inherited provider</Switch.Label>
          </Switch.RootProvider>
        </Switch.PropsProvider>
        <button type="button" onClick={toggleProviderSize} data-testid="provider-size-toggle">
          Toggle provider size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Switch State',
  component: SwitchStateContract,
} satisfies Meta<typeof SwitchStateContract>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: SwitchStateContract };
