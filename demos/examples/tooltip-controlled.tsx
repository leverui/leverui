import { createSignal, Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Button, Flex, Tooltip } from '../../src';

/** Reflect the tooltip's open state in its trigger text. */
export function TooltipControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  return (
    <Tooltip
      content="A short hint about this button"
      open={open()}
      onOpenChange={
        /** Synchronize the caller's controlled state with the tooltip. */
        (details) => setOpen(details.open)
      }
    >
      {
        /** Show the current controlled state inside the button. */
        (getProps) => (
          <Button {...getProps()} size="sm">
            {open() ? 'Hide' : 'Show'} tooltip
          </Button>
        )
      }
    </Tooltip>
  );
}

/** Own one controlled tooltip in each row of the list. */
function DemoTooltip(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  return (
    <Tooltip
      open={open()}
      positioning={{ placement: 'left' }}
      content="A short hint about this row"
      onOpenChange={
        /** Track this row's machine without changing its neighbors. */
        (details) => setOpen(details.open)
      }
    >
      {
        /** Forward hover and focus onto the styled Box. */
        (getProps) => (
          <Box
            {...getProps()}
            textStyle="sm"
            style={{
              'padding-inline': 'var(--lui-spacing-2)',
              'padding-block': 'var(--lui-spacing-1)',
              background: 'var(--lui-colors-color-palette-subtle)',
              color: 'var(--lui-colors-color-palette-fg)',
              'box-shadow': '0 0 0 1px var(--lui-colors-color-palette-muted)',
            }}
          >
            Hover me
          </Box>
        )
      }
    </Tooltip>
  );
}

/** Show ten independent controlled Tooltips in a vertical stack. */
export function TooltipControlledMultiple(): JSX.Element {
  return (
    <Box style={{ display: 'grid', gap: 'var(--lui-spacing-2)' }}>
      <Repeat count={10}>
        {() => (
          <Flex>
            <DemoTooltip />
          </Flex>
        )}
      </Repeat>
    </Box>
  );
}
