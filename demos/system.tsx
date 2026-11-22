import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import './system-examples.css';
import {
  SystemAlertStyles,
  SystemCompoundBoolean,
  SystemCompoundColorPalette,
  SystemFlexLayout,
  SystemNativeButton,
} from './examples/system-recipe-examples';
import {
  SystemAnimation,
  SystemAsChild,
  SystemColorPalette,
  SystemButtonAppearance,
  SystemPartHooks,
} from './examples/system-hook-examples';
import { SystemCheckboxParts } from './examples/system-inline-slot';

export const meta = {
  component: SystemAlertStyles,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const AlertStyles: Story = { render: SystemAlertStyles };
export const ColorPalette: Story = { render: SystemColorPalette };
export const FlexLayout: Story = { render: SystemFlexLayout };
export const NativeButton: Story = { render: SystemNativeButton };
export const CheckboxParts: Story = { render: SystemCheckboxParts };
export const Animation: Story = { render: SystemAnimation };
export const AsChild: Story = { render: SystemAsChild };
export const CompoundBoolean: Story = { render: SystemCompoundBoolean };
export const CompoundColorPalette: Story = { render: SystemCompoundColorPalette };
export const ButtonAppearance: Story = { render: SystemButtonAppearance };
export const PartHooks: Story = { render: SystemPartHooks };
