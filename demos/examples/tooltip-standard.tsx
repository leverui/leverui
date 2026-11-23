import { type JSX } from '@solidjs/web';
import { BellIcon } from '@lucide/solid';
import {
  Button,
  Stack,
  Tooltip,
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from '../../src';

/** Show a tooltip on an outline button. */
export function TooltipBasic(): JSX.Element {
  return (
    <Tooltip content="A short hint about this button">
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

/** Add the floating arrow to the default tooltip. */
export function TooltipWithArrow(): JSX.Element {
  return (
    <Tooltip showArrow content="A short hint about this button">
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

/** Change the Tooltip surface and arrow through a public CSS variable. */
export function TooltipWithCustomBg(): JSX.Element {
  return (
    <Tooltip
      showArrow
      content="You have 3 new notifications"
      contentProps={{ style: { '--lui-tooltip-background': 'tomato' } }}
    >
      {
        /** Keep the bell and count inside the small button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size="sm">
            <BellIcon /> 3
          </Button>
        )
      }
    </Tooltip>
  );
}

/** Keep the tooltip closed while its trigger remains usable. */
export function TooltipWithDisabled(): JSX.Element {
  return (
    <Tooltip content="A short hint about this button" disabled>
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

/** Keep an open tooltip available for the anatomy explorer. */
export function TooltipExplorerDemo(): JSX.Element {
  return (
    <Stack align="center" gap="10" style={{ 'padding-block': 'var(--lui-spacing-16)' }}>
      <TooltipRoot open>
        <TooltipTrigger
          asChild={
            /** Forward Tooltip trigger behavior to the button. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm">
                Hover me
              </Button>
            )
          }
        />
        <TooltipPositioner>
          <TooltipContent>
            A short hint about this button
            <TooltipArrow>
              <TooltipArrowTip />
            </TooltipArrow>
          </TooltipContent>
        </TooltipPositioner>
      </TooltipRoot>
    </Stack>
  );
}
