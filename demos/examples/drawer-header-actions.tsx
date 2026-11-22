import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, CloseButton, Drawer, Portal } from '../../src';

/** Place the close control and action group in the Drawer header. */
export function DrawerWithHeaderActions(): JSX.Element {
  return (
    <Drawer.Root size="md">
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
              <Drawer.CloseTrigger
                style={{ position: 'static' }}
                asChild={
                  /** Keep the header close control in its natural layout position. */
                  (getProps) => <CloseButton {...getProps()} />
                }
              />
              <Drawer.Title style={{ flex: 1 }}>Review changes</Drawer.Title>
              <ButtonGroup>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </ButtonGroup>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                You changed the title and the summary of this article. Save to publish the new
                version.
              </p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
