import { type JSX } from '@solidjs/web';
import { Button, Input, Popover, Portal, Text, Theme } from '../../src';
import './theme-display.css';

/** Bridge an explicit dark theme into a portalled Popover content element. */
export function ThemeWithPortalled(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger
        asChild={
          /** Forward trigger behavior onto the outline button. */
          (getProps) => (
            <Button {...getProps()} size="sm" variant="outline">
              Click me
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            asChild={
              /** Keep the portalled content inside one dark theme scope. */
              (getProps) => (
                <Theme {...getProps()} hasBackground={false} appearance="dark" colorPalette="teal">
                  <Popover.Arrow />
                  <Popover.Body class="theme-example-popover-body">
                    <Popover.Title class="theme-example-popover-title">
                      Lanternwright notes
                    </Popover.Title>
                    <Text>
                      The Lanternwright Chronicles is a fantasy novel series about an apprentice
                      lamplighter in a city that rearranges itself every night.
                    </Text>
                    <Input placeholder="Search" />
                    <Button>Click me</Button>
                  </Popover.Body>
                </Theme>
              )
            }
          />
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
