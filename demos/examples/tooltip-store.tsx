import { type JSX } from '@solidjs/web';
import { Button, HStack, Tooltip, useTooltip } from '../../src';

/** Toggle a caller-owned Tooltip machine from an adjacent button. */
export function TooltipWithStore(): JSX.Element {
  const tooltip = useTooltip();

  /** Toggle the external machine without remounting its provider. */
  function toggleOpen(): void {
    tooltip().setOpen(!tooltip().open);
  }

  return (
    <HStack>
      <Button size="sm" variant="subtle" onClick={toggleOpen}>
        Toggle
      </Button>
      <Tooltip.RootProvider value={tooltip}>
        <Tooltip.Trigger
          asChild={
            /** Attach the machine trigger to the outline target button. */
            (getProps) => (
              <Button {...getProps()} variant="outline">
                Tooltip target
              </Button>
            )
          }
        />
        <Tooltip.Positioner>
          <Tooltip.Content>A short hint about this button</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.RootProvider>
    </HStack>
  );
}
