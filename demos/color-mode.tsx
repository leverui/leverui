import type { Demo, DemoMeta } from './demo-types';
import { ColorModeIconButton, ColorModeValueFallback } from './examples/color-mode-buttons';
import { ColorModeBasic, ColorModeForced, ColorModeValue } from './examples/color-mode-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ColorModeBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ColorModeBasic };
export const Forced: Story = { render: ColorModeForced };
export const IconButton: Story = { render: ColorModeIconButton };
export const Value: Story = { render: ColorModeValue };
export const ValueFallback: Story = { render: ColorModeValueFallback };
