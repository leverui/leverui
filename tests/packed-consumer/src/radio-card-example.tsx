import { RadioCard, type RadioCardValueChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise packaged Radio Card selection and consumer CSS. */
export function PackedRadioCard(): JSX.Element {
  const [selected, setSelected] = createSignal('react');

  /** Keep the selected native form value in consumer state. */
  function handleValueChange(details: RadioCardValueChangeDetails): void {
    setSelected(details.value ?? 'react');
  }

  return (
    <form data-testid="packed-radio-card-form">
      <RadioCard.Root
        name="framework"
        value={selected()}
        onValueChange={handleValueChange}
        variant="solid"
        class="packed-radio-card"
        data-testid="packed-radio-card-root"
      >
        <RadioCard.Label>Framework</RadioCard.Label>
        <RadioCard.Item value="react">
          <RadioCard.ItemHiddenInput />
          <RadioCard.ItemControl>
            <RadioCard.ItemText>React</RadioCard.ItemText>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemControl>
        </RadioCard.Item>
        <RadioCard.Item value="solid">
          <RadioCard.ItemHiddenInput />
          <RadioCard.ItemControl data-testid="packed-radio-card-control">
            <RadioCard.ItemText>Solid</RadioCard.ItemText>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemControl>
        </RadioCard.Item>
      </RadioCard.Root>
      <output data-testid="packed-radio-card-value">{selected()}</output>
    </form>
  );
}
