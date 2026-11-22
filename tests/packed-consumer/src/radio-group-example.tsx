import { RadioGroup, type RadioGroupValueChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise packaged Radio Group selection and consumer CSS. */
export function PackedRadioGroup(): JSX.Element {
  const [selected, setSelected] = createSignal<string | null>('react');

  /** Keep the selected native form value in consumer state. */
  function handleValueChange(details: RadioGroupValueChangeDetails): void {
    setSelected(details.value);
  }

  return (
    <form data-testid="packed-radio-group-form">
      <RadioGroup.Root
        name="framework"
        value={selected()}
        onValueChange={handleValueChange}
        variant="solid"
        class="packed-radio-group"
        data-testid="packed-radio-group-root"
      >
        <RadioGroup.Label>Framework</RadioGroup.Label>
        <RadioGroup.Item value="react">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator />
          <RadioGroup.ItemText>React</RadioGroup.ItemText>
        </RadioGroup.Item>
        <RadioGroup.Item value="solid">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator data-testid="packed-radio-group-indicator" />
          <RadioGroup.ItemText>Solid</RadioGroup.ItemText>
        </RadioGroup.Item>
      </RadioGroup.Root>
      <output data-testid="packed-radio-group-value">{selected()}</output>
    </form>
  );
}
