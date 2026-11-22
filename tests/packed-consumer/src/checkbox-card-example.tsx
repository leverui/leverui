import { CheckboxCard, type CheckboxCardCheckedChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise packaged card state, styles, and native form behavior. */
export function PackedCheckboxCard(): JSX.Element {
  const [checked, setChecked] = createSignal(false);

  /** Apply the published change details to a Solid signal. */
  function updateChecked(details: CheckboxCardCheckedChangeDetails): void {
    setChecked(details.checked === true);
  }

  return (
    <form data-testid="packed-card-form">
      <CheckboxCard.Root
        class="packed-checkbox-card"
        checked={checked()}
        onCheckedChange={updateChecked}
        name="packed-card"
        value="yes"
        data-testid="packed-card-root"
      >
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control data-testid="packed-card-control">
          <CheckboxCard.Content>
            <CheckboxCard.Label>Packed card choice</CheckboxCard.Label>
            <CheckboxCard.Description>Installed package</CheckboxCard.Description>
          </CheckboxCard.Content>
          <CheckboxCard.Indicator />
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    </form>
  );
}
