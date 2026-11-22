import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Toggle } from '../src';
import './toggle-css.css';

/** Compare two caller-owned CSS classes on Toggle parts. */
function ToggleCssExample(): JSX.Element {
  return (
    <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
      <Toggle.Root aria-label="Named CSS Toggle" class="toggle-css-named">
        <Toggle.Indicator fallback="Off" class="toggle-css-indicator">
          On
        </Toggle.Indicator>
        <span class="toggle-css-probe" data-testid="toggle-named-probe">
          CSS probe
        </span>
      </Toggle.Root>
      <Toggle.Root aria-label="Instance CSS Toggle" class="toggle-css-instance">
        <Toggle.Indicator fallback="Off" class="toggle-css-indicator">
          On
        </Toggle.Indicator>
        <Toggle.Indicator data-testid="toggle-empty-override" />
        <span class="toggle-css-probe" data-testid="toggle-instance-probe">
          CSS probe
        </span>
      </Toggle.Root>
      <Toggle.Root aria-label="Unstyled Toggle" unstyled>
        <Toggle.Indicator data-testid="toggle-unstyled-indicator" />
      </Toggle.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Toggle CSS',
  component: ToggleCssExample,
} satisfies Meta<typeof ToggleCssExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Custom: Story = { render: ToggleCssExample };
