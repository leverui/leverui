import { type JSX } from '@solidjs/web';
import { Button, HStack, Popover, Portal, ToggleTip, Tooltip } from '../../src';

/** Build the same tooltip with the shortcut and with its parts. */
export function TooltipWithParts(): JSX.Element {
  return (
    <HStack gap="4">
      <Tooltip content="This is the tooltip content">
        {
          /** Forward Tooltip trigger behavior to the button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Shortcut
            </Button>
          )
        }
      </Tooltip>
      <Tooltip.Root>
        <Tooltip.Trigger
          asChild={
            /** Forward Tooltip trigger behavior to the button. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm">
                Parts
              </Button>
            )
          }
        />
        <Portal>
          <Tooltip.Positioner>
            <Tooltip.Content>This is the tooltip content</Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      </Tooltip.Root>
    </HStack>
  );
}

/** Build the same toggle tip with the shortcut and with the Popover parts. */
export function ToggleTipWithParts(): JSX.Element {
  return (
    <HStack gap="4">
      <ToggleTip content="This is some additional information.">
        {
          /** Forward Popover trigger behavior to the button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Shortcut
            </Button>
          )
        }
      </ToggleTip>
      <Popover.Root size="xs">
        <Popover.Trigger
          asChild={
            /** Forward Popover trigger behavior to the button. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm">
                Parts
              </Button>
            )
          }
        />
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Body>This is some additional information.</Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </HStack>
  );
}
