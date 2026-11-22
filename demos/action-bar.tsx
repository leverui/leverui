import type { Demo, DemoMeta } from './demo-types';
import { ActionBarBasic, ActionBarWithCloseTrigger } from './examples/action-bar-simple';
import { ActionBarWithDialog } from './examples/action-bar-dialog';
import { ActionBarPlacement } from './examples/action-bar-placement';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ActionBarBasic,
  decorators: [withComponentInset],
  parameters: { guide: { naturalHeight: true } },
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: ActionBarBasic,
};
export const CloseTrigger: Story = {
  render: ActionBarWithCloseTrigger,
  parameters: {
    guide: {
      description:
        'Render `ActionBar.CloseTrigger` to close the action bar, and pass `onOpenChange` to control its visibility. The `open` and `onOpenChange` props control the bar together.',
    },
  },
};
export const WithDialog: Story = {
  render: ActionBarWithDialog,
  parameters: {
    guide: {
      description:
        'Compose the `ActionBar` and `Dialog` to perform a delete action on selected items. Press `Delete projects` to open the dialog.',
    },
  },
};
export const Placement: Story = {
  render: ActionBarPlacement,
  parameters: {
    guide: {
      description:
        'Use `placement` to position the action bar at `bottom` (default), `bottom-start`, or `bottom-end`.',
    },
  },
};
