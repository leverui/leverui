import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Drawer, Portal } from '../../src';

/** Open the default end-placed Drawer. */
export function DrawerBasic(): JSX.Element {
  return (
    <Drawer.Root>
      <Drawer.Trigger
        asChild={
          /** Forward trigger behavior to the small outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open drawer
            </Button>
          )
        }
      />
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Save this filter</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                This filter shows open orders from the last 30 days. Save it to use it again later.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

/** Keep the Drawer open state in a Solid signal. */
export function DrawerControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Drawer.Root
      open={open()}
      onOpenChange={
        /** Synchronize the controlled state with the Drawer's close actions. */
        (details) => setOpen(details.open)
      }
    >
      <Drawer.Trigger
        asChild={
          /** Forward trigger behavior to the small outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open drawer
            </Button>
          )
        }
      />
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Save draft</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                Your message to the design team is not finished. Save it as a draft and come back to
                it later.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

/** Inset the Drawer by one spacing unit on every side. */
export function DrawerWithOffset(): JSX.Element {
  return (
    <Drawer.Root>
      <Drawer.Trigger
        asChild={
          /** Forward trigger behavior to the small outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open drawer
            </Button>
          )
        }
      />
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner style={{ padding: 'var(--leverui-spacing-4)' }}>
          <Drawer.Content style={{ 'border-radius': 'var(--leverui-radii-md)' }}>
            <Drawer.Header>
              <Drawer.Title>Save report</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                This report covers sales from January to March. Save it to find it later under
                Reports.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

/** Keep the surrounding page interactive while the Drawer remains open. */
export function DrawerNonModal(): JSX.Element {
  return (
    <Drawer.Root closeOnInteractOutside={false} modal={false}>
      <Drawer.Trigger
        asChild={
          /** Forward trigger behavior to the small outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open drawer
            </Button>
          )
        }
      />
      <Portal>
        <Drawer.Positioner style={{ 'pointer-events': 'none' }}>
          <Drawer.Content style={{ 'pointer-events': 'auto' }}>
            <Drawer.Header>
              <Drawer.Title>Quick notes</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                You can still use the page behind this drawer. It stays open until you close it.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.ActionTrigger
                asChild={
                  /** Close through the action trigger. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
