import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Drawer, HStack, Kbd, Portal, Text } from '../../src';

/** Show all four Drawer placements. */
export function DrawerWithPlacement(): JSX.Element {
  return (
    <HStack wrap="wrap">
      <For each={['bottom', 'top', 'start', 'end'] as const}>
        {
          /** Give each trigger its own placement-specific Drawer. */
          (placement) => (
            <Drawer.Root placement={placement}>
              <Drawer.Trigger
                asChild={
                  /** Label the trigger with its current placement. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline" size="sm">
                      Open ({placement})
                    </Button>
                  )
                }
              />
              <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                  <Drawer.Content
                    style={{
                      'border-top-left-radius':
                        placement === 'bottom' ? 'var(--lui-radii-l3)' : undefined,
                      'border-top-right-radius':
                        placement === 'bottom' ? 'var(--lui-radii-l3)' : undefined,
                      'border-bottom-left-radius':
                        placement === 'top' ? 'var(--lui-radii-l3)' : undefined,
                      'border-bottom-right-radius':
                        placement === 'top' ? 'var(--lui-radii-l3)' : undefined,
                    }}
                  >
                    <Drawer.Header>
                      <Drawer.Title>Drawer title</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <p>Each button opens a drawer from a different edge of the screen.</p>
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
          )
        }
      </For>
    </HStack>
  );
}

/** Show the six Drawer sizes on separate triggers. */
export function DrawerWithSizes(): JSX.Element {
  return (
    <HStack wrap="wrap">
      <For each={['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const}>
        {
          /** Give each size an independent Drawer machine. */
          (size) => (
            <Drawer.Root size={size}>
              <Drawer.Trigger
                asChild={
                  /** Label the trigger with its current size. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline" size="sm">
                      Open ({size})
                    </Button>
                  )
                }
              />
              <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                  <Drawer.Content>
                    <Drawer.Header>
                      <Drawer.Title>Drawer title</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      Press the <Kbd>esc</Kbd> key to close the drawer.
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
          )
        }
      </For>
    </HStack>
  );
}

/** Change placement at the mobile breakpoint. */
export function DrawerWithConditionalVariants(): JSX.Element {
  return (
    <>
      <Text style={{ 'margin-bottom': 'var(--lui-spacing-4)' }}>
        Open the drawer, then make the window as narrow as a phone.
      </Text>
      <Drawer.Root placement={{ mdDown: 'bottom', md: 'end' }}>
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
                <Drawer.Title>Drawer title</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                Press the <Kbd>esc</Kbd> key to close the drawer.
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
    </>
  );
}
