import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { ToggleWithIndicator, ToggleWithPressedIcon } from './examples/toggle-indicators';
import { ToggleBasic, ToggleControlled } from './examples/toggle-standard';
import './toggle-button.css';

export const meta = {
  component: ToggleBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ToggleBasic };
export const Controlled: Story = { render: ToggleControlled };
export const Indicator: Story = { render: ToggleWithIndicator };
export const PressedIcon: Story = { render: ToggleWithPressedIcon };
