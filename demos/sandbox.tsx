import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { SandboxColorPalette, SandboxReRenders } from './examples/sandbox-interactions';
import {
  SandboxCustomAnimation,
  SandboxLayers,
  SandboxSelfClosing,
  SandboxSortOrder,
} from './examples/sandbox-presentation';

export const meta = {
  component: SandboxReRenders,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const ReRenders: Story = { render: SandboxReRenders };
export const ColorPalette: Story = { render: SandboxColorPalette };
export const SelfClosing: Story = { render: SandboxSelfClosing };
export const Layers: Story = { render: SandboxLayers };
export const SortOrder: Story = { render: SandboxSortOrder };
export const CustomAnimation: Story = { render: SandboxCustomAnimation };
