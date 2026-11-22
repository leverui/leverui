import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { InputGroup, NumberInput } from '../src';

/** Exercise stepping, bounds, keyboard entry, and reactive CSS choices. */
function NumberInputContractExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Toggle machine and appearance state without replacing the native input. */
  function toggleState(): void {
    setDisabled(!disabled());
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  return (
    <>
      <div data-testid="number-input-contract">
        <NumberInput.Root
          defaultValue={2}
          min={0}
          max={6}
          step={2}
          name="quantity"
          disabled={disabled()}
          size={size()}
          data-testid="number-root"
        >
          <NumberInput.Label>Quantity</NumberInput.Label>
          <NumberInput.Input data-testid="number-input" />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger data-testid="number-increment" />
            <NumberInput.DecrementTrigger data-testid="number-decrement" />
          </NumberInput.Control>
          <NumberInput.ValueText data-testid="number-value" />
        </NumberInput.Root>
        <button type="button" onClick={toggleState} data-testid="number-toggle">
          Toggle Number Input state
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Number Input',
  component: NumberInputContractExample,
} satisfies Meta<typeof NumberInputContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};

/** Show CSS-owned group padding around a machine-owned numeric field. */
function NumberInputGroupExample(): JSX.Element {
  const [adorned, setAdorned] = createSignal(true);
  const [offset, setOffset] = createSignal('0px');

  /** Change the offset without replacing the numeric input. */
  function changeOffset(): void {
    setOffset('4px');
  }

  /** Remove the adornment while retaining the numeric value. */
  function removeAdornment(): void {
    setAdorned(false);
  }

  return (
    <>
      <NumberInput.Root defaultValue={10} size="sm" style={{ width: '260px' }}>
        <InputGroup startElement={adorned() ? '$' : undefined} startOffset={offset()}>
          <NumberInput.Input data-testid="grouped-number-input" />
        </InputGroup>
      </NumberInput.Root>
      <button type="button" data-testid="grouped-number-offset" onClick={changeOffset}>
        Change offset
      </button>
      <button type="button" data-testid="grouped-number-adornment" onClick={removeAdornment}>
        Remove adornment
      </button>
    </>
  );
}

/** Exercise group padding through native CSS with live Solid props. */
export const Grouped: StoryObj<typeof NumberInputGroupExample> = {
  render: NumberInputGroupExample,
};

/** Show responsive numeric geometry and surface choices without runtime CSS. */
function NumberInputResponsiveExample(): JSX.Element {
  return (
    <>
      <NumberInput.Root
        defaultValue={3}
        size={{ base: 'xs', md: 'lg' }}
        variant={{ base: 'outline', md: 'subtle' }}
        style={{ width: '260px' }}
        data-testid="responsive-number-root"
      >
        <NumberInput.Input data-testid="responsive-number-input" />
        <NumberInput.Control data-testid="responsive-number-control" />
      </NumberInput.Root>
    </>
  );
}

/** Let Chromium verify the active breakpoint values and CSS override hooks. */
export const ResponsiveAppearance: StoryObj<typeof NumberInputResponsiveExample> = {
  render: NumberInputResponsiveExample,
};
