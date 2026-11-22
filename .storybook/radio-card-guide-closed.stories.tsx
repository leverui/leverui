import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioCard } from '../src';
import { ClosedRadioCardItem } from './radio-card-guide-closed';

/** Exercise the Solid closed-item composition with a native input ref. */
function ClosedComponentExample(): JSX.Element {
  let input: HTMLInputElement | undefined;

  /** Retain the input forwarded through the closed composition. */
  function receiveInput(element: HTMLInputElement): void {
    input = element;
  }

  /** Expose the actual native input for the browser contract check. */
  function inspectInput(): void {
    const output = document.querySelector('[data-testid="guide-radio-card-closed-ref"]');
    if (output) output.textContent = input?.tagName ?? 'missing';
  }

  return (
    <>
      <form data-testid="guide-radio-card-closed-form">
        <RadioCard.Root defaultValue="next" name="framework">
          <RadioCard.Label>Select framework</RadioCard.Label>
          <ClosedRadioCardItem
            value="next"
            label="Next.js"
            description="Best for apps"
            addon="Most popular"
            ref={receiveInput}
            inputProps={{ 'data-testid': 'guide-radio-card-closed-input' }}
          />
          <ClosedRadioCardItem value="vite" label="Vite" indicatorPlacement="start" />
          <ClosedRadioCardItem value="astro" label="Astro" indicator={null} />
        </RadioCard.Root>
        <button type="button" onClick={inspectInput}>
          Inspect input ref
        </button>
        <output data-testid="guide-radio-card-closed-ref" />
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Radio Card Guide Closed',
  component: ClosedComponentExample,
} satisfies Meta<typeof ClosedComponentExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ClosedComponent: Story = { render: ClosedComponentExample };
