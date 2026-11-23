import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Switch } from '../src';
import { SwitchNativeCompositionExample } from '../demos/examples/switch-native-composition';
import { SwitchResponsiveVariantsExample } from '../demos/examples/switch-responsive-variants';

/** Exercise controlled state, native forms, indicators, and live variants. */
function SwitchContractExample(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  const [large, setLarge] = createSignal(false);

  /** Keep selection in one Solid signal. */
  function handleCheckedChange(details: { checked: boolean }): void {
    setChecked(details.checked);
  }

  /** Change appearance without replacing the machine root. */
  function toggleAppearance(): void {
    setLarge(!large());
  }

  return (
    <>
      <form data-testid="switch-form" style={{ padding: '24px' }}>
        <Switch.Root
          name="notifications"
          value="yes"
          checked={checked()}
          onCheckedChange={handleCheckedChange}
          size={large() ? 'lg' : 'sm'}
          variant={large() ? 'raised' : 'solid'}
          data-testid="switch-root"
        >
          <Switch.HiddenInput />
          <Switch.Control data-testid="switch-control">
            <Switch.Indicator fallback="Off">On</Switch.Indicator>
            <Switch.Thumb data-testid="switch-thumb">
              <Switch.ThumbIndicator fallback="−">✓</Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
          <Switch.Label>Notifications</Switch.Label>
        </Switch.Root>
        <output data-testid="switch-value">{checked() ? 'on' : 'off'}</output>
        <button type="button" onClick={toggleAppearance} data-testid="switch-appearance-toggle">
          Toggle appearance
        </button>
      </form>
    </>
  );
}

/** Show disabled, read-only, invalid, required, and external-machine paths. */
function SwitchStateExample(): JSX.Element {
  const machine = Switch.useSwitch({ defaultChecked: true });
  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <Switch.Root disabled defaultChecked>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Disabled</Switch.Label>
        </Switch.Root>
        <Switch.Root readOnly defaultChecked>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Readonly</Switch.Label>
        </Switch.Root>
        <Switch.Root invalid required>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Invalid required</Switch.Label>
        </Switch.Root>
        <Switch.PropsProvider value={{ size: 'lg' }}>
          <Switch.RootProvider value={machine} data-testid="switch-provider-root">
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>External</Switch.Label>
          </Switch.RootProvider>
        </Switch.PropsProvider>
      </div>
    </>
  );
}

const appearanceMatrix = [
  { size: 'xs', variant: 'solid' },
  { size: 'xs', variant: 'raised' },
  { size: 'sm', variant: 'solid' },
  { size: 'sm', variant: 'raised' },
  { size: 'md', variant: 'solid' },
  { size: 'md', variant: 'raised' },
  { size: 'lg', variant: 'solid' },
  { size: 'lg', variant: 'raised' },
] as const;

/** Show all size and variant combinations and a consumer stylesheet override. */
function SwitchAppearanceExample(): JSX.Element {
  return (
    <>
      <style>{'.switch-consumer .leverui-switch__control { background: rgb(1, 99, 222); }'}</style>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <For each={appearanceMatrix}>
          {
            /** Render one CSS size and variant pair. */
            ({ size, variant }) => (
              <Switch.Root
                size={size}
                variant={variant}
                data-testid={`switch-matrix-${size}-${variant}`}
              >
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label>{`${size} ${variant}`}</Switch.Label>
              </Switch.Root>
            )
          }
        </For>
        <Switch.Root class="switch-consumer">
          <Switch.HiddenInput />
          <Switch.Control data-testid="switch-css-override-control" />
          <Switch.Label>Consumer override</Switch.Label>
        </Switch.Root>
        <Switch.Root style={{ '--lui-colors-bg-emphasized': 'rgb(8, 88, 152)' }}>
          <Switch.HiddenInput />
          <Switch.Control
            data-testid="switch-native-style-control"
            style={{ 'border-radius': '7px' }}
          />
          <Switch.Label>Native style</Switch.Label>
        </Switch.Root>
        <Switch.Root unstyled data-testid="switch-unstyled-root">
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Unstyled root</Switch.Label>
        </Switch.Root>
        <Switch.Root data-testid="switch-unstyled-control-root">
          <Switch.HiddenInput />
          <Switch.Control unstyled />
          <Switch.Label>Unstyled control</Switch.Label>
        </Switch.Root>
      </div>
    </>
  );
}

/** Show object and sparse-array size choices across viewport breakpoints. */
function SwitchResponsiveSizesExample(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <Switch.Root
          size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xs', '2xl': 'md' }}
          data-testid="switch-responsive-object"
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Object sizes</Switch.Label>
        </Switch.Root>
        <Switch.Root size={['lg', null, 'xs']} data-testid="switch-responsive-array">
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Array sizes</Switch.Label>
        </Switch.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Switch',
  component: SwitchContractExample,
} satisfies Meta<typeof SwitchContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: SwitchContractExample };
export const States: Story = { render: SwitchStateExample };
export const Appearance: Story = { render: SwitchAppearanceExample };
export const ResponsiveSizes: Story = { render: SwitchResponsiveSizesExample };
export const ResponsiveVariants: Story = { render: SwitchResponsiveVariantsExample };
export const NativeComposition: Story = { render: SwitchNativeCompositionExample };
