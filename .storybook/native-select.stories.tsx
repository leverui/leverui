import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, NativeSelect } from '../src';
import '../demos/examples/native-select-examples.css';

/** Exercise native editing, Field state, variants, and consumer CSS. */
function NativeSelectContractExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const [value, setValue] = createSignal('');

  /** Toggle the surrounding Field's disabled state. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  /** Toggle the surrounding Field's validation state. */
  function toggleInvalid(): void {
    setInvalid(!invalid());
  }

  /** Change the root's authored CSS size without replacing its select. */
  function toggleSize(): void {
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  /** Reflect the native select's changed value. */
  function handleChange(event: Event): void {
    setValue((event.currentTarget as HTMLSelectElement).value);
  }

  return (
    <>
      <div class="native-select-contract">
        <Field.Root id="country" disabled={disabled()} invalid={invalid()} required>
          <Field.Label>Country</Field.Label>
          <NativeSelect.Root data-testid="native-select-root" size={size()} variant="outline">
            <NativeSelect.Field
              name="country"
              placeholder="Choose a country"
              onChange={handleChange}
            >
              <option value="ca">Canada</option>
              <option value="us">United States</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator data-testid="native-select-indicator" />
          </NativeSelect.Root>
          <Field.ErrorText>Choose a country</Field.ErrorText>
        </Field.Root>
        <output data-testid="native-select-value">{value()}</output>
        <button type="button" onClick={toggleDisabled} data-testid="native-select-disable">
          Toggle disabled
        </button>
        <button type="button" onClick={toggleInvalid} data-testid="native-select-invalid">
          Toggle invalid
        </button>
        <button type="button" onClick={toggleSize} data-testid="native-select-size">
          Toggle size
        </button>
        <NativeSelect.Root
          size={{ base: 'xs', md: 'lg' }}
          variant={{ base: 'outline', md: 'subtle' }}
          data-testid="native-select-responsive"
        >
          <NativeSelect.Field aria-label="Responsive country">
            <option value="ca">Canada</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <NativeSelect.Root unstyled data-testid="native-select-unstyled">
          <NativeSelect.Field aria-label="Unstyled country">
            <option value="ca">Canada</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Native Select',
  component: NativeSelectContractExample,
} satisfies Meta<typeof NativeSelectContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
