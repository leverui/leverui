import { type JSX } from '@solidjs/web';
import { DateInput } from '../../src';

/** Render the label, segmented editor, and form value. */
export function DateInputParts(props: { label: string }): JSX.Element {
  return (
    <>
      <DateInput.Label>{props.label}</DateInput.Label>
      <DateInput.Control>
        <DateInput.Segments />
      </DateInput.Control>
      <DateInput.HiddenInput />
    </>
  );
}
