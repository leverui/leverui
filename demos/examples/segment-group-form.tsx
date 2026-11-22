import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Field, SegmentGroup, Stack } from '../../src';

/** Demonstrate controlled Segment Group form submission in Solid. */
export function SegmentGroupHookForm(): JSX.Element {
  const [fontSize, setFontSize] = createSignal<string | null>('md');
  const [error, setError] = createSignal('');

  /** Keep the selected form field in Solid state. */
  function updateFontSize(details: { value: string | null }): void {
    setFontSize(details.value);
    setError('');
  }

  /** Validate the required value before the example logs its submission. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const value = fontSize();
    if (!value) {
      setError('Font size is required');
      return;
    }
    console.log({ fontSize: value });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start">
        <Field.Root invalid={Boolean(error())}>
          <Field.Label>Font size</Field.Label>
          <SegmentGroup.Root
            size="sm"
            name="fontSize"
            value={fontSize()}
            onValueChange={updateFontSize}
          >
            <SegmentGroup.Items items={['sm', 'md', 'lg']} />
            <SegmentGroup.Indicator />
          </SegmentGroup.Root>
          <Field.ErrorText>{error()}</Field.ErrorText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
