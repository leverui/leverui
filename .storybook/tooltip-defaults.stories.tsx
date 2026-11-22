import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Portal,
  TooltipContent,
  TooltipPositioner,
  TooltipPropsProvider,
  TooltipRoot,
  TooltipTrigger,
} from '../src';

/** Exercise reactive defaults, instance precedence, and a consumer CSS token. */
function TooltipDefaultsExample(): JSX.Element {
  const [unstyled, setUnstyled] = createSignal(false);

  /** Recompute inherited Tooltip defaults as caller state changes. */
  function readDefaults() {
    return {
      lazyMount: false,
      unmountOnExit: false,
      unstyled: unstyled(),
      openDelay: 0,
      closeDelay: 0,
    };
  }

  /** Toggle default CSS styling without remounting the Tooltip roots. */
  function toggleStyles(): void {
    setUnstyled(!unstyled());
  }

  return (
    <>
      <style>{'html{--leverui-colors-bg-inverted:rgb(12,34,56)}'}</style>
      <div style={{ padding: '140px', display: 'flex', gap: '90px' }}>
        <TooltipPropsProvider value={readDefaults}>
          <TooltipRoot>
            <TooltipTrigger data-testid="defaults-closed-trigger">Closed</TooltipTrigger>
            <Portal>
              <TooltipPositioner>
                <TooltipContent data-testid="defaults-closed-content">
                  Closed details
                </TooltipContent>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
          <TooltipRoot defaultOpen>
            <TooltipTrigger data-testid="defaults-reactive-trigger">Reactive</TooltipTrigger>
            <Portal>
              <TooltipPositioner>
                <TooltipContent data-testid="defaults-reactive-content">
                  Reactive details
                </TooltipContent>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
          <TooltipRoot lazyMount unstyled={false}>
            <TooltipTrigger data-testid="defaults-explicit-trigger">Explicit</TooltipTrigger>
            <Portal>
              <TooltipPositioner>
                <TooltipContent data-testid="defaults-explicit-content">
                  Explicit details
                </TooltipContent>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
          <button type="button" onClick={toggleStyles} data-testid="defaults-toggle">
            Toggle styles
          </button>
        </TooltipPropsProvider>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tooltip Defaults',
  component: TooltipDefaultsExample,
} satisfies Meta<typeof TooltipDefaultsExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Reactive: Story = {};
