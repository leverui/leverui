import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogContext,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogPropsProvider,
  DialogRootProvider,
  DialogTitle,
  DialogTrigger,
  Portal,
  useDialog,
} from '../src';

/** Exercise caller-owned state, layout slots, context, and action dismissal. */
function DialogFamilyContent(): JSX.Element {
  const dialog = useDialog();
  const [wide, setWide] = createSignal(false);
  const [actions, setActions] = createSignal(0);
  const [openDuringAction, setOpenDuringAction] = createSignal('not-called');
  const [boundAction, setBoundAction] = createSignal('not-called');
  const [preventedAction, setPreventedAction] = createSignal(false);
  const [bubbles, setBubbles] = createSignal(0);

  /** Resolve live appearance defaults without remounting the external machine. */
  function readFamilyDefaults(): { size: 'sm' | 'lg'; placement: 'center' } {
    return { size: wide() ? 'lg' : 'sm', placement: 'center' };
  }

  /** Change only the inherited CSS appearance while keeping the external machine. */
  function toggleSize(): void {
    setWide(!wide());
  }

  /** Record that the consumer click ran before the Dialog action closed. */
  function recordAction(): void {
    setOpenDuringAction(String(dialog().open));
    setActions(actions() + 1);
  }

  /** Record Solid's bound data, native event, and still-open machine state. */
  function recordBoundAction(
    data: string,
    event: MouseEvent & { currentTarget: HTMLButtonElement },
  ): void {
    setBoundAction(`${data}:${event.type}:${event.currentTarget.tagName}:${dialog().open}`);
  }

  /** Prevent the native default while allowing the action to close. */
  function preventAction(event: MouseEvent): void {
    event.preventDefault();
    setPreventedAction(event.defaultPrevented);
  }

  /** Count clicks forwarded through the Portal event bridge. */
  function countBubble(): void {
    setBubbles(bubbles() + 1);
  }

  /** Open the machine independently of any rendered trigger. */
  function openExternal(): void {
    dialog().setOpen(true);
  }

  /** Render the public context's reactive open state. */
  function renderContext(context: typeof dialog): JSX.Element {
    return <output data-testid="dialog-family-state">{String(context().open)}</output>;
  }

  return (
    <div data-testid="dialog-family-example" onClick={countBubble}>
      <button type="button" data-testid="dialog-external-open" onClick={openExternal}>
        Open through external machine
      </button>
      <DialogPropsProvider value={readFamilyDefaults}>
        <DialogRootProvider value={dialog} lazyMount unmountOnExit>
          <DialogTrigger data-testid="dialog-family-trigger">Open family Dialog</DialogTrigger>
          <DialogContext>{renderContext}</DialogContext>
          <Portal>
            <DialogBackdrop data-testid="dialog-family-backdrop" />
            <DialogPositioner data-testid="dialog-family-positioner">
              <DialogContent data-testid="dialog-family-content">
                <DialogHeader data-testid="dialog-family-header">
                  <DialogTitle>Family Dialog</DialogTitle>
                  <DialogDescription>Caller-owned state and layout slots</DialogDescription>
                </DialogHeader>
                <DialogBody data-testid="dialog-family-body">
                  <input aria-label="Dialog family input" />
                  <p>Dialog body content</p>
                  <button type="button" data-testid="dialog-variant-toggle" onClick={toggleSize}>
                    Change Dialog size
                  </button>
                </DialogBody>
                <DialogFooter data-testid="dialog-family-footer">
                  <DialogActionTrigger data-testid="dialog-family-action" onClick={recordAction}>
                    Save and close
                  </DialogActionTrigger>
                  <DialogActionTrigger
                    data-testid="dialog-family-bound-action"
                    onClick={[recordBoundAction, 'bound-data']}
                  >
                    Bound save and close
                  </DialogActionTrigger>
                  <DialogActionTrigger
                    data-testid="dialog-family-prevented-action"
                    onClick={preventAction}
                  >
                    Prevent and close
                  </DialogActionTrigger>
                  <DialogActionTrigger
                    onClick={recordAction}
                    asChild={
                      /** Keep the action on a caller-rendered button. */
                      (getProps) => (
                        <button {...getProps()} data-testid="dialog-family-child-action">
                          Child save and close
                        </button>
                      )
                    }
                  />
                  <DialogCloseTrigger data-testid="dialog-family-close">Close</DialogCloseTrigger>
                </DialogFooter>
              </DialogContent>
            </DialogPositioner>
          </Portal>
        </DialogRootProvider>
      </DialogPropsProvider>
      <output data-testid="dialog-family-actions">{actions()}</output>
      <output data-testid="dialog-action-open-state">{openDuringAction()}</output>
      <output data-testid="dialog-bound-action">{boundAction()}</output>
      <output data-testid="dialog-prevented-action">{String(preventedAction())}</output>
      <output data-testid="dialog-bubbles">{bubbles()}</output>
    </div>
  );
}

/** Mount the primitive's external state machine under the public Lever UI provider. */
function DialogFamilyExample(): JSX.Element {
  return (
    <>
      <DialogFamilyContent />
    </>
  );
}

const meta = {
  title: 'Components/Dialog Family',
  component: DialogFamilyExample,
} satisfies Meta<typeof DialogFamilyExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
