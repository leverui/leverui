import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Switch } from '../src';
import { SwitchGuideIcon } from './switch-guide-icon';

/** Show the guide's checked and fallback glyphs on the track and thumb. */
function SwitchGuideIndicators(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '24px', padding: '24px' }}>
        <Switch.Root colorPalette="blue" size="lg" data-testid="switch-guide-track">
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<SwitchGuideIcon name="moon" color="gray.400" />}>
              <SwitchGuideIcon name="sun" color="yellow.400" />
            </Switch.Indicator>
          </Switch.Control>
          <Switch.Label>Track indicator</Switch.Label>
        </Switch.Root>
        <Switch.Root size="lg" data-testid="switch-guide-thumb">
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb>
              <Switch.ThumbIndicator fallback={<SwitchGuideIcon name="x" color="black" raw />}>
                <SwitchGuideIcon name="check" raw />
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
          <Switch.Label>Thumb indicator</Switch.Label>
        </Switch.Root>
      </div>
    </>
  );
}

/** Exercise live switching between the native and styled icon paths. */
function SwitchGuideIconMode(): JSX.Element {
  const [raw, setRaw] = createSignal(false);

  /** Change the icon renderer without replacing the surrounding story. */
  function toggleMode(): void {
    setRaw(!raw());
  }

  return (
    <>
      <button type="button" onClick={toggleMode}>
        Toggle icon mode
      </button>
      <SwitchGuideIcon name="check" raw={raw()} />
      <output data-testid="switch-guide-icon-mode">{raw() ? 'raw' : 'styled'}</output>
    </>
  );
}

const meta = {
  title: 'Components/Switch Guide Indicators',
  component: SwitchGuideIndicators,
} satisfies Meta<typeof SwitchGuideIndicators>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: SwitchGuideIndicators };
export const ReactiveMode: Story = { render: SwitchGuideIconMode };
