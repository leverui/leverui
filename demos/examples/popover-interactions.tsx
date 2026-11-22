import { type JSX } from '@solidjs/web';
import { Button, HStack, Popover, Portal, Text } from '../../src';

/** Reveal which of the three triggers opened the panel. */
export function PopoverMultipleTriggers(): JSX.Element {
  return (
    <Popover.Root>
      <HStack>
        <Popover.Trigger
          value="profile"
          asChild={
            /** Forward the trigger props to the styled button. */
            (getProps) => (
              <Button {...getProps()} size="sm" variant="outline">
                Profile
              </Button>
            )
          }
        />
        <Popover.Trigger
          value="settings"
          asChild={
            /** Forward the trigger props to the styled button. */
            (getProps) => (
              <Button {...getProps()} size="sm" variant="outline">
                Settings
              </Button>
            )
          }
        />
        <Popover.Trigger
          value="help"
          asChild={
            /** Forward the trigger props to the styled button. */
            (getProps) => (
              <Button {...getProps()} size="sm" variant="outline">
                Help
              </Button>
            )
          }
        />
      </HStack>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Context>
                {
                  /** Display the active trigger value inside the panel. */
                  (api) => (
                    <>
                      <Popover.Title
                        style={{
                          'font-weight': 'var(--leverui-font-weights-medium)',
                          'text-transform': 'capitalize',
                        }}
                      >
                        {api().triggerValue}
                      </Popover.Title>
                      Opened from the {api().triggerValue} trigger.
                    </>
                  )
                }
              </Popover.Context>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

/** Keep a child Popover inside its parent's floating surface. */
export function PopoverNested(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger
        asChild={
          /** Forward the trigger props to the styled button. */
          (getProps) => (
            <Button {...getProps()} size="sm" variant="outline">
              Click me
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Text style={{ 'margin-bottom': 'var(--leverui-spacing-4)' }}>
                The Lanternwright Chronicles is a fantasy novel series about an apprentice
                lamplighter in a city that rearranges itself every night.
              </Text>
              <Popover.Root>
                <Popover.Trigger
                  asChild={
                    /** Pass child trigger behavior to the small outline button. */
                    (getProps) => (
                      <Button {...getProps()} size="xs" variant="outline">
                        Open nested popover
                      </Button>
                    )
                  }
                />
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>This popover opens inside the first one.</Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
