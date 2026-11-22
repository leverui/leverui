import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DrawerContent, DrawerPositioner, DrawerRoot, DrawerTitle } from '../src';

/** Compare initial Drawer animations with and without the presence option. */
function DrawerPresenceExample(props: { skipAnimationOnMount: boolean }): JSX.Element {
  const [animationCount, setAnimationCount] = createSignal(0);

  /** Count entry animations at the actual content boundary. */
  function recordAnimationStart(): void {
    setAnimationCount(animationCount() + 1);
  }

  return (
    <>
      <DrawerRoot defaultOpen skipAnimationOnMount={props.skipAnimationOnMount}>
        <DrawerPositioner>
          <DrawerContent
            onAnimationStart={recordAnimationStart}
            data-testid="drawer-initial-presence"
          >
            <DrawerTitle>Initially open Drawer</DrawerTitle>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
      <output data-testid="drawer-animation-count">{animationCount()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Drawer Presence',
  component: DrawerPresenceExample,
} satisfies Meta<typeof DrawerPresenceExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Skipped: Story = { args: { skipAnimationOnMount: true } };

export const Animated: Story = { args: { skipAnimationOnMount: false } };
