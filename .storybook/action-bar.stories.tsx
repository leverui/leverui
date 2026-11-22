import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ActionBar, Button, Dialog } from '../src';
import type { ActionBarCloseTriggerProps, ActionBarOpenChangeDetails } from '../src';

type GetCloseProps = Parameters<NonNullable<ActionBarCloseTriggerProps['asChild']>>[0];

/** Give the primitive's close behavior to a caller-owned native button. */
function renderCloseButton(getProps: GetCloseProps): JSX.Element {
  return (
    <button {...getProps({ class: 'consumer-close' })} data-testid="action-bar-child-close">
      ×
    </button>
  );
}

/** Exercise selection-driven visibility, dismissal, and guide composition. */
function ActionBarStory(): JSX.Element {
  const [selected, setSelected] = createSignal(false);
  const [lastAction, setLastAction] = createSignal('none');

  /** Follow the selection control without submitting the specimen form. */
  function changeSelection(event: Event): void {
    setSelected((event.currentTarget as HTMLInputElement).checked);
  }

  /** Synchronize the controlled bar after its close trigger or Escape. */
  function changeOpen(details: ActionBarOpenChangeDetails): void {
    setSelected(details.open);
  }

  /** Record an action while leaving the selection available. */
  function archiveSelection(): void {
    setLastAction('archived');
  }

  /** Make the caller's positioner ref observable after portal mounting. */
  function capturePositioner(element: Element): void {
    element.setAttribute('data-caller-ref', 'attached');
  }

  return (
    <>
      <div style={{ padding: '32px', 'min-height': '420px' }}>
        <form>
          <label>
            <input type="checkbox" checked={selected()} onChange={changeSelection} /> Select row
          </label>
          <p data-testid="action-bar-selection">{selected() ? 'selected' : 'clear'}</p>
          <p data-testid="action-bar-last-action">{lastAction()}</p>
          <ActionBar.Root
            open={selected()}
            onOpenChange={changeOpen}
            closeOnInteractOutside={false}
          >
            <Portal>
              <ActionBar.Positioner ref={capturePositioner} data-testid="action-bar-positioner">
                <ActionBar.Content aria-label="Selection actions" data-testid="action-bar-content">
                  <ActionBar.SelectionTrigger>1 selected</ActionBar.SelectionTrigger>
                  <ActionBar.Separator />
                  <Button type="button" onClick={archiveSelection}>
                    Archive
                  </Button>
                  <Dialog.Root placement="center">
                    <Dialog.Trigger data-testid="action-bar-dialog-trigger">
                      Open dialog
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content data-testid="action-bar-dialog-content">
                          <Dialog.Title>Confirm selection</Dialog.Title>
                          <Dialog.CloseTrigger>Close dialog</Dialog.CloseTrigger>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>
                  <ActionBar.CloseTrigger aria-label="Close actions" asChild={renderCloseButton} />
                </ActionBar.Content>
              </ActionBar.Positioner>
            </Portal>
          </ActionBar.Root>
        </form>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Action Bar',
  component: ActionBarStory,
} satisfies Meta<typeof ActionBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selection: Story = { render: ActionBarStory };

/** Exercise the primitive's uncontrolled initial state and close trigger. */
function UncontrolledActionBarStory(): JSX.Element {
  return (
    <>
      <div style={{ padding: '32px', 'min-height': '420px' }}>
        <ActionBar.Root defaultOpen>
          <ActionBar.Positioner>
            <ActionBar.Content
              aria-label="Uncontrolled actions"
              data-testid="uncontrolled-action-bar"
            >
              <ActionBar.SelectionTrigger>4 selected</ActionBar.SelectionTrigger>
              <ActionBar.CloseTrigger aria-label="Close selection">
                Close selection
              </ActionBar.CloseTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
      </div>
    </>
  );
}

export const Uncontrolled: Story = { render: UncontrolledActionBarStory };
