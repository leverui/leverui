import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, Toggle } from '../src';
import { ToggleGuideIcon } from './toggle-guide-icon';
import './toggle-guide.css';

/** Match the basic guide's icon button with one stable accessible name. */
function ToggleBasicExample(): JSX.Element {
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Toggle.Root
          aria-label="Bold"
          asChild={
            /** Keep the primitive's pressed behavior on the styled button. */
            (getProps) => (
              <Button {...getProps()} class="toggle-guide-button" variant="subtle">
                <ToggleGuideIcon name="bold" />
              </Button>
            )
          }
        />
      </div>
    </>
  );
}

/** Match the guide's two independent pressed and fallback indicators. */
function ToggleIndicatorExample(): JSX.Element {
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Toggle.Root
          aria-label="Mute"
          asChild={
            /** Render icon and text indicators in the same primitive button. */
            (getProps) => (
              <Button {...getProps()} class="toggle-guide-button" variant="outline">
                <Toggle.Indicator
                  data-testid="volume-icon"
                  fallback={<ToggleGuideIcon name="volume2" />}
                >
                  <ToggleGuideIcon name="volumeX" />
                </Toggle.Indicator>
                <Toggle.Indicator data-testid="volume-label" fallback="Mute">
                  Unmute
                </Toggle.Indicator>
              </Button>
            )
          }
        />
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Toggle Guide',
  component: ToggleBasicExample,
} satisfies Meta<typeof ToggleBasicExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: ToggleBasicExample };
export const Indicators: Story = { render: ToggleIndicatorExample };
