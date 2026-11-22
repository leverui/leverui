import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { PinInput } from '../src';
import './pin-input-css.css';

const sizes = { base: 'xs', md: 'lg' } as const;
const variants = { base: 'outline', md: 'subtle' } as const;
const attached = { base: true, md: false, lg: true } as const;
const breakpointAttached = {
  base: true,
  sm: false,
  md: true,
  lg: false,
  xl: true,
  '2xl': false,
} as const;
const breakpointSizes = {
  base: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
} as const;
const breakpointVariants = {
  base: 'outline',
  sm: 'subtle',
  md: 'flushed',
  lg: 'outline',
  xl: 'subtle',
  '2xl': 'flushed',
} as const;

/** Expose CSS overrides, responsive choices, and reactive Zag state. */
function PinInputCssContract(): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Change appearance and validation without remounting the input. */
  function toggleAppearance(): void {
    setChanged(!changed());
  }

  return (
    <div style={{ display: 'grid', gap: '24px', padding: '24px' }}>
      <button type="button" data-testid="pin-css-toggle" onClick={toggleAppearance}>
        Toggle Pin Input
      </button>
      <PinInput.Root
        count={4}
        size={sizes}
        variant={variants}
        attached={changed() ? false : attached}
        invalid={changed()}
        class="pin-input-css-root"
        data-testid="pin-css-root"
      >
        <PinInput.Label class="pin-input-css-label" data-testid="pin-css-label">
          Verification code
        </PinInput.Label>
        <PinInput.HiddenInput name="pin-css-code" />
        <PinInput.Control class="pin-input-css-control" data-testid="pin-css-control">
          <PinInput.Input index={0} data-testid="pin-css-input-0" />
          <PinInput.Input index={1} class="pin-input-css-custom" data-testid="pin-css-input-1" />
          <PinInput.Input index={2} data-testid="pin-css-input-2" />
          <PinInput.Input index={3} data-testid="pin-css-input-3" />
        </PinInput.Control>
      </PinInput.Root>
      <PinInput.Root
        count={2}
        size={breakpointSizes}
        variant={breakpointVariants}
        attached={breakpointAttached}
        data-testid="pin-css-breakpoints"
      >
        <PinInput.Control data-testid="pin-css-breakpoints-control">
          <PinInput.Input index={0} data-testid="pin-css-breakpoints-input" />
          <PinInput.Input index={1} />
        </PinInput.Control>
      </PinInput.Root>
      <PinInput.Root count={2} unstyled data-testid="pin-css-unstyled-root">
        <PinInput.Control>
          <PinInput.Input index={0} class="pin-input-css-unstyled" data-testid="pin-css-unstyled" />
          <PinInput.Input index={1} />
        </PinInput.Control>
      </PinInput.Root>
    </div>
  );
}

const meta = {
  title: 'Internal/Pin Input CSS',
  component: PinInputCssContract,
} satisfies Meta<typeof PinInputCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: PinInputCssContract };
