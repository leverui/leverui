import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Drawer, Portal } from '../../src';

/** Show the live Drawer machine state inside its body. */
export function DrawerWithContext(): JSX.Element {
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
            <Drawer.Context>
              {
                /** Render controls against the nearest reactive Drawer context. */
                (store) => (
                  <Drawer.Body
                    style={{
                      'padding-top': 'var(--leverui-spacing-6)',
                      display: 'flex',
                      'flex-direction': 'column',
                      gap: 'var(--leverui-spacing-3)',
                    }}
                  >
                    <p>Drawer is open: {store().open ? 'true' : 'false'}</p>
                    <p>
                      The line above reads the drawer's state. The button below closes the drawer
                      from the inside.
                    </p>
                    <button
                      type="button"
                      onClick={
                        /** Close the active Drawer through its machine API. */
                        () => store().setOpen(false)
                      }
                    >
                      Close
                    </button>
                  </Drawer.Body>
                )
              }
            </Drawer.Context>
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
