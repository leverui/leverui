import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Drawer, Portal, Stack, Text } from '../../src';

/** Position a Drawer inside a consumer-owned relative container. */
export function DrawerWithCustomContainer(): JSX.Element {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  return (
    <Drawer.Root closeOnInteractOutside={false}>
      <Stack
        align="flex-start"
        ref={setContainer}
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'var(--lui-spacing-8)',
          'min-height': '400px',
          outline: '2px solid gray',
          background: 'var(--lui-colors-color-palette-subtle)',
          color: 'var(--lui-colors-color-palette-fg)',
        }}
      >
        <Text>Render drawer here</Text>
        <Drawer.Trigger
          asChild={
            /** Keep the background-aware trigger inside the destination Stack. */
            (getProps) => (
              <Button
                {...getProps()}
                variant="outline"
                size="sm"
                style={{ background: 'var(--lui-colors-bg)' }}
              >
                Open drawer
              </Button>
            )
          }
        />
      </Stack>
      <Portal container={container}>
        <Drawer.Backdrop style={{ position: 'absolute', width: '100%', height: '100%' }} />
        <Drawer.Positioner style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Save this layout</Drawer.Title>
              <Drawer.CloseTrigger
                asChild={
                  /** Preserve close behavior on the CloseButton. */
                  (getProps) => <CloseButton {...getProps()} size="sm" />
                }
              />
            </Drawer.Header>
            <Drawer.Body>
              <p>
                The sidebar is on the left and the table shows ten rows. Save this layout to use it
                next time.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
