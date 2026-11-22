import { createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Portal,
  Switch,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from '../src';

/** Compose the public Tooltip trigger around a native Switch root. */
function SwitchGuideTooltip(): JSX.Element {
  const triggerId = createUniqueId();
  return (
    <>
      <div style={{ padding: '120px' }}>
        <TooltipRoot ids={{ trigger: triggerId }} openDelay={0} closeDelay={0}>
          <TooltipTrigger
            asChild={
              /** Preserve Tooltip events on the Switch's native label. */
              (getProps) => (
                <Switch.Root
                  {...getProps()}
                  ids={{ root: triggerId }}
                  data-testid="switch-guide-tooltip-root"
                >
                  <Switch.HiddenInput aria-describedby={getProps()['aria-describedby']} />
                  <Switch.Control />
                  <Switch.Label>Switch with tooltip</Switch.Label>
                </Switch.Root>
              )
            }
          />
          <Portal>
            <TooltipPositioner>
              <TooltipContent data-testid="switch-guide-tooltip-content">
                This is a tooltip
              </TooltipContent>
            </TooltipPositioner>
          </Portal>
        </TooltipRoot>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Switch Guide Tooltip',
  component: SwitchGuideTooltip,
} satisfies Meta<typeof SwitchGuideTooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: SwitchGuideTooltip };
