import { NumberInput } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Exercise an installed Number Input with native form and consumer CSS. */
export function PackedNumberInput(): JSX.Element {
  return (
    <section class="packed-number-input" aria-label="Packed Number Input example">
      <NumberInput.Root defaultValue={2} min={0} max={4} step={2} name="quantity">
        <NumberInput.Label>Quantity</NumberInput.Label>
        <NumberInput.Input data-testid="packed-number-input" />
        <NumberInput.HiddenInput />
        <NumberInput.Control>
          <NumberInput.IncrementTrigger data-testid="packed-number-increment" />
          <NumberInput.DecrementTrigger data-testid="packed-number-decrement" />
        </NumberInput.Control>
      </NumberInput.Root>
    </section>
  );
}
