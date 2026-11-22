import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  Portal,
  type DrawerRootProps,
} from '../src';

interface ChoiceExampleProps {
  size: DrawerRootProps['size'];
  placement: DrawerRootProps['placement'];
  contained?: DrawerRootProps['contained'];
}

/** Render one open Drawer for responsive appearance checks. */
function ChoiceExample(props: ChoiceExampleProps): JSX.Element {
  return (
    <>
      <DrawerRoot
        defaultOpen
        size={props.size}
        placement={props.placement}
        contained={props.contained}
      >
        <Portal>
          <DrawerPositioner data-testid="drawer-responsive-css-positioner">
            <DrawerContent data-testid="drawer-responsive-css-content">
              <DrawerTitle>Responsive Drawer</DrawerTitle>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </>
  );
}

/** Exercise the six ordinary responsive array positions. */
function ArrayChoicesExample(): JSX.Element {
  return (
    <ChoiceExample
      size={['xs', 'sm', 'md', 'lg', 'xl', 'full']}
      placement={['start', 'end', 'top', 'bottom', 'start', 'end']}
    />
  );
}

/** Exercise the five descending range selectors. */
function DownChoicesExample(): JSX.Element {
  return (
    <ChoiceExample
      size={{
        base: 'sm',
        '2xlDown': 'md',
        xlDown: 'lg',
        lgDown: 'xl',
        mdDown: 'full',
        smDown: 'xs',
        '2xl': 'full',
      }}
      placement={{
        base: 'end',
        '2xlDown': 'start',
        xlDown: 'top',
        lgDown: 'bottom',
        mdDown: 'end',
        smDown: 'start',
        '2xl': 'end',
      }}
    />
  );
}

/** Exercise contained toggles at all ordinary array breakpoints. */
function ContainedArrayExample(): JSX.Element {
  return (
    <ChoiceExample size="sm" placement="end" contained={[false, true, false, true, false, true]} />
  );
}

/** Exercise contained toggles across the downward range cascade. */
function ContainedRangesExample(): JSX.Element {
  return (
    <ChoiceExample
      size="sm"
      placement="end"
      contained={{
        base: false,
        '2xlDown': true,
        xlDown: false,
        lgDown: true,
        mdDown: false,
        smDown: true,
        '2xl': false,
      }}
    />
  );
}

const meta = {
  title: 'Components/Drawer Responsive CSS',
  component: ArrayChoicesExample,
} satisfies Meta<typeof ArrayChoicesExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const ArrayChoices: Story = {};
export const DownChoices: Story = { render: DownChoicesExample };
export const ContainedArray: Story = { render: ContainedArrayExample };
export const ContainedRanges: Story = { render: ContainedRangesExample };
