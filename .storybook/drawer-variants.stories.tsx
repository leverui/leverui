import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Portal,
  type DrawerRootProps,
} from '../src';

type DrawerSize = Extract<NonNullable<DrawerRootProps['size']>, string>;
type DrawerPlacement = Extract<NonNullable<DrawerRootProps['placement']>, string>;

/** Keep all scalar Drawer variants on one mounted machine. */
function DrawerVariantsExample(): JSX.Element {
  const [size, setSize] = createSignal<DrawerSize>('xs');
  const [placement, setPlacement] = createSignal<DrawerPlacement>('end');
  const [contained, setContained] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);

  /** Accept only the six Drawer size variants. */
  function selectSize(event: Event & { currentTarget: HTMLSelectElement }): void {
    const value = event.currentTarget.value;
    switch (value) {
      case 'xs':
      case 'sm':
      case 'md':
      case 'lg':
      case 'xl':
      case 'full':
        setSize(value);
        return;
      default:
        throw new Error(`Unknown Drawer size: ${value}`);
    }
  }

  /** Accept only the four Drawer placements. */
  function selectPlacement(event: Event & { currentTarget: HTMLSelectElement }): void {
    const value = event.currentTarget.value;
    switch (value) {
      case 'start':
      case 'end':
      case 'top':
      case 'bottom':
        setPlacement(value);
        return;
      default:
        throw new Error(`Unknown Drawer placement: ${value}`);
    }
  }

  /** Toggle the contained offset on the live Drawer. */
  function selectContained(event: Event & { currentTarget: HTMLInputElement }): void {
    setContained(event.currentTarget.checked);
  }

  /** Toggle authored Drawer presentation without remounting the primitive state. */
  function selectUnstyled(event: Event & { currentTarget: HTMLInputElement }): void {
    setUnstyled(event.currentTarget.checked);
  }

  return (
    <>
      <DrawerRoot
        defaultOpen
        size={size()}
        placement={placement()}
        contained={contained()}
        unstyled={unstyled()}
      >
        <DrawerTrigger>Open variant Drawer</DrawerTrigger>
        <Portal>
          <DrawerPositioner data-testid="drawer-variant-positioner">
            <DrawerContent data-testid="drawer-variant-content">
              <DrawerHeader>
                <DrawerTitle>Drawer variants</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <label>
                  Size
                  <select aria-label="Drawer size" onChange={selectSize}>
                    <option value="xs">Extra small</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra large</option>
                    <option value="full">Full</option>
                  </select>
                </label>
                <label>
                  Placement
                  <select aria-label="Drawer placement" onChange={selectPlacement}>
                    <option value="end">End</option>
                    <option value="start">Start</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </label>
                <label>
                  <input type="checkbox" checked={contained()} onChange={selectContained} />
                  Contained
                </label>
                <label>
                  <input type="checkbox" checked={unstyled()} onChange={selectUnstyled} />
                  Unstyled
                </label>
              </DrawerBody>
              <DrawerCloseTrigger>Close variants</DrawerCloseTrigger>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </>
  );
}

/** Resolve placement and size through CSS conditions as the viewport changes. */
function DrawerResponsiveExample(): JSX.Element {
  return (
    <>
      <DrawerRoot
        defaultOpen
        size={{ mdDown: 'full', md: 'lg' }}
        placement={{ mdDown: 'bottom', md: 'end' }}
      >
        <DrawerTrigger>Open responsive Drawer</DrawerTrigger>
        <Portal>
          <DrawerPositioner data-testid="drawer-responsive-positioner">
            <DrawerContent data-testid="drawer-responsive-content">
              <DrawerHeader>
                <DrawerTitle>Responsive Drawer</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>Resize the viewport to change the Drawer.</DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </>
  );
}

const meta = {
  title: 'Components/Drawer Variants',
  component: DrawerVariantsExample,
} satisfies Meta<typeof DrawerVariantsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
export const Responsive: Story = { render: DrawerResponsiveExample };
