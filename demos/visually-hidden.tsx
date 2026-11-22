import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { BellIcon } from '@lucide/solid';
import { Button, HStack, VisuallyHidden } from '../src';
import { withComponentInset } from './examples/example-frame';

/** Add a screen-reader label after a visible notification count. */
function VisuallyHiddenBasic(): JSX.Element {
  return (
    <Button>
      <BellIcon /> 3 <VisuallyHidden>Notifications</VisuallyHidden>
    </Button>
  );
}

/** Clip a native input by rendering it through the child renderer. */
function VisuallyHiddenWithInput(): JSX.Element {
  return (
    <HStack>
      The input is hidden
      <VisuallyHidden
        asChild={
          /** Apply the clipping props to the caller's input. */
          (getProps) => <input {...getProps()} type="text" placeholder="Search..." />
        }
      />
    </HStack>
  );
}

export const meta = {
  component: VisuallyHiddenBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: VisuallyHiddenBasic };
export const Input: Story = {
  render: VisuallyHiddenWithInput,
  parameters: {
    guide: {
      description:
        'Using the `asChild` render function, you can pass a child element to the `VisuallyHidden` component.',
    },
  },
};
