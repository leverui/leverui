import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DrawerActionTrigger,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Portal,
} from '../src';

/** Exercise action cancellation, bubbling, bound handlers, and caller-owned children. */
function DrawerActionExample(): JSX.Element {
  const [action, setAction] = createSignal('none');
  const [bubbles, setBubbles] = createSignal(0);

  /** Record an action whose native default was prevented by the consumer. */
  function preventAction(event: MouseEvent): void {
    event.preventDefault();
    setAction(`prevented:${event.defaultPrevented}`);
  }

  /** Record Solid's bound event form before the Drawer closes. */
  function boundAction(label: string, event: MouseEvent): void {
    setAction(`${label}:${event.type}`);
  }

  /** Record the callback on a caller-rendered action button. */
  function childAction(): void {
    setAction('child');
  }

  /** Observe a click that bubbles through the Solid Portal event bridge. */
  function countBubble(): void {
    setBubbles(bubbles() + 1);
  }

  return (
    <>
      <div onClick={countBubble}>
        <DrawerRoot>
          <DrawerTrigger data-testid="action-drawer-trigger">Open action Drawer</DrawerTrigger>
          <Portal>
            <DrawerPositioner>
              <DrawerContent data-testid="action-drawer-content">
                <DrawerTitle>Action Drawer</DrawerTitle>
                <DrawerActionTrigger data-testid="action-drawer-prevented" onClick={preventAction}>
                  Prevent and close
                </DrawerActionTrigger>
                <DrawerActionTrigger
                  data-testid="action-drawer-bound"
                  onClick={[boundAction, 'bound']}
                >
                  Bound and close
                </DrawerActionTrigger>
                <DrawerActionTrigger
                  onClick={childAction}
                  asChild={
                    /** Keep the action on a caller-rendered native button. */
                    (getProps) => (
                      <button {...getProps()} data-testid="action-drawer-child">
                        Child and close
                      </button>
                    )
                  }
                />
              </DrawerContent>
            </DrawerPositioner>
          </Portal>
        </DrawerRoot>
      </div>
      <output data-testid="action-drawer-result">{action()}</output>
      <output data-testid="action-drawer-bubbles">{bubbles()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Drawer Action',
  component: DrawerActionExample,
} satisfies Meta<typeof DrawerActionExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
