import { type JSX } from '@solidjs/web';
import { Button, HStack, Tooltip } from '../../src';

/** Delay opening by 500ms and closing by 100ms. */
export function TooltipWithDelay(): JSX.Element {
  return (
    <Tooltip content="This tooltip opens after half a second" openDelay={500} closeDelay={100}>
      {
        /** Forward Tooltip trigger behavior to the button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size="sm">
            Delay (open: 500ms, close: 100ms)
          </Button>
        )
      }
    </Tooltip>
  );
}

/** Allow the pointer to move into the open Tooltip surface. */
export function TooltipWithInteractive(): JSX.Element {
  return (
    <Tooltip content="You can move the pointer onto this tooltip" interactive>
      {
        /** Forward Tooltip trigger behavior to the button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size="sm">
            Hover me
          </Button>
        )
      }
    </Tooltip>
  );
}

/** Offset both floating axes by four pixels. */
export function TooltipWithOffset(): JSX.Element {
  return (
    <Tooltip
      content="A short hint about this button"
      positioning={{ offset: { mainAxis: 4, crossAxis: 4 } }}
    >
      {
        /** Forward Tooltip trigger behavior to the button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size="sm">
            Hover me
          </Button>
        )
      }
    </Tooltip>
  );
}

/** Align the Tooltip to the trigger's right end. */
export function TooltipWithPlacement(): JSX.Element {
  return (
    <Tooltip content="A short hint about this button" positioning={{ placement: 'right-end' }}>
      {
        /** Forward Tooltip trigger behavior to the button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size="sm">
            Hover me
          </Button>
        )
      }
    </Tooltip>
  );
}

/** Show two independent Tooltip roots beside one another. */
export function TooltipMultiple(): JSX.Element {
  return (
    <HStack>
      <Tooltip content="Hint for button 1">
        {
          /** Forward the first Tooltip's trigger behavior. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Button 1
            </Button>
          )
        }
      </Tooltip>
      <Tooltip content="Hint for button 2">
        {
          /** Forward the second Tooltip's trigger behavior. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Button 2
            </Button>
          )
        }
      </Tooltip>
    </HStack>
  );
}
