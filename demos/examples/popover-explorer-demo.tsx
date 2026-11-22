import { type JSX } from '@solidjs/web';
import { Button, Flex, Input, Popover, Text } from '../../src';

/** Keep every Popover part open and unportaled for the anatomy Explorer. */
export function PopoverExplorerDemo(): JSX.Element {
  return (
    <div style={{ 'min-height': '340px', width: '100%' }}>
      <Popover.Root open autoFocus={false} positioning={{ placement: 'bottom-start' }}>
        <Popover.Anchor style={{ width: 'fit-content' }}>
          <Popover.Trigger
            asChild={
              /** Keep trigger behavior on the outline button. */
              (getProps) => (
                <Button {...getProps()} size="sm" variant="outline">
                  Click me
                </Button>
              )
            }
          />
        </Popover.Anchor>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Header>
              <Popover.Title style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>
                Lanternwright Notes
              </Popover.Title>
              <Popover.Description>
                A fantasy novel series about an apprentice lamplighter in a city that rearranges
                itself every night.
              </Popover.Description>
            </Popover.Header>
            <Popover.Body>
              <Text style={{ 'margin-bottom': 'var(--leverui-spacing-3)' }}>
                Enter your favorite character below:
              </Text>
              <Input placeholder="Your favorite character" size="sm" />
            </Popover.Body>
            <Popover.Footer>
              <Flex
                style={{
                  width: '100%',
                  gap: 'var(--leverui-spacing-2)',
                  'justify-content': 'flex-end',
                }}
              >
                <Popover.CloseTrigger
                  asChild={
                    /** Keep close behavior on the outline button. */
                    (getProps) => (
                      <Button {...getProps()} size="sm" variant="outline">
                        Cancel
                      </Button>
                    )
                  }
                />
                <Button size="sm">Save</Button>
              </Flex>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </div>
  );
}
