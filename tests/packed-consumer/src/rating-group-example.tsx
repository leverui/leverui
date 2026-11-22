import { RatingGroup, type RatingGroupValueChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise packaged Rating Group selection and consumer CSS. */
export function PackedRatingGroup(): JSX.Element {
  const [selected, setSelected] = createSignal(2);

  /** Keep the selected native form value in consumer state. */
  function handleValueChange(details: RatingGroupValueChangeDetails): void {
    setSelected(details.value);
  }

  return (
    <form data-testid="packed-rating-group-form">
      <RatingGroup.Root
        name="score"
        value={selected()}
        onValueChange={handleValueChange}
        class="packed-rating-group"
        data-testid="packed-rating-group-root"
      >
        <RatingGroup.Label>Quality</RatingGroup.Label>
        <RatingGroup.Control />
        <RatingGroup.HiddenInput />
      </RatingGroup.Root>
      <output data-testid="packed-rating-group-value">{selected()}</output>
    </form>
  );
}
