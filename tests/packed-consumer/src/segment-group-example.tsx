import { SegmentGroup, type SegmentGroupValueChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise packaged Segment Group selection and consumer CSS. */
export function PackedSegmentGroup(): JSX.Element {
  const [selected, setSelected] = createSignal<string | null>('React');

  /** Keep the selected native form value in consumer state. */
  function handleValueChange(details: SegmentGroupValueChangeDetails): void {
    setSelected(details.value);
  }

  return (
    <form data-testid="packed-segment-group-form">
      <SegmentGroup.Root
        name="framework"
        aria-label="Framework"
        value={selected()}
        onValueChange={handleValueChange}
        class="packed-segment-group"
        data-testid="packed-segment-group-root"
      >
        <SegmentGroup.Indicator data-testid="packed-segment-group-indicator" />
        <SegmentGroup.Items items={['React', 'Solid']} />
      </SegmentGroup.Root>
      <output data-testid="packed-segment-group-value">{selected()}</output>
    </form>
  );
}
