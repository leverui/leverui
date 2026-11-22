import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Checkmark, Theme } from '../src';

/** Show the states and size and variant combinations in one browser fixture. */
function CheckmarkContractExample(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  const [indeterminate, setIndeterminate] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);

  /** Cycle unchecked, checked, and indeterminate without remounting. */
  function cycleState(): void {
    if (!checked() && !indeterminate()) setChecked(true);
    else if (checked()) {
      setChecked(false);
      setIndeterminate(true);
    } else setIndeterminate(false);
  }

  /** Toggle disabled styling on the same SVG. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Checkmark data-testid="checkmark-unchecked" />
          <Checkmark checked data-testid="checkmark-checked" />
          <Checkmark indeterminate data-testid="checkmark-indeterminate" />
          <Checkmark disabled data-testid="checkmark-disabled" />
          <Checkmark checked disabled data-testid="checkmark-checked-disabled" />
        </div>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Checkmark checked variant="solid" data-testid="checkmark-solid" />
          <Checkmark checked variant="outline" filled data-testid="checkmark-filled" />
          <Checkmark checked variant="subtle" data-testid="checkmark-subtle" />
          <Checkmark checked variant="plain" data-testid="checkmark-plain" />
          <Checkmark checked variant="inverted" data-testid="checkmark-inverted" />
        </div>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Checkmark checked size="xs" data-testid="checkmark-xs" />
          <Checkmark checked size="sm" data-testid="checkmark-sm" />
          <Checkmark checked size="md" data-testid="checkmark-md" />
          <Checkmark checked size="lg" data-testid="checkmark-lg" />
          <Checkmark checked colorPalette="teal" data-testid="checkmark-teal" />
          <Checkmark checked size={{ base: 'xs', md: 'lg' }} data-testid="checkmark-responsive" />
        </div>
        <Theme appearance="dark" hasBackground={false}>
          <Checkmark checked colorPalette="blue" data-testid="checkmark-dark" />
        </Theme>
        <Checkmark
          checked={checked()}
          indeterminate={indeterminate()}
          disabled={disabled()}
          data-testid="checkmark-reactive"
        />
        <button type="button" onClick={cycleState} data-testid="checkmark-cycle">
          Cycle state
        </button>
        <button type="button" onClick={toggleDisabled} data-testid="checkmark-toggle-disabled">
          Toggle disabled
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Feedback/Checkmark',
  component: CheckmarkContractExample,
} satisfies Meta<typeof CheckmarkContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
