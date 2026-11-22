import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { RatingGroup, useRatingGroup } from '../../src';
import '../rating-group-examples.css';

/** Show five stars with an initial three-star value. */
export function RatingBasic(): JSX.Element {
  return (
    <RatingGroup.Root count={5} defaultValue={3} size="sm">
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  );
}

/** Keep the selected rating in a Solid signal. */
export function RatingControlled(): JSX.Element {
  const [value, setValue] = createSignal(3);

  /** Apply a new rating returned by the machine. */
  function updateValue(details: { value: number }): void {
    setValue(details.value);
  }

  return (
    <RatingGroup.Root count={5} value={value()} onValueChange={updateValue}>
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  );
}

/** Show a half-selected star. */
export function RatingHalf(): JSX.Element {
  return (
    <RatingGroup.Root allowHalf count={5} defaultValue={3.5} size="sm">
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  );
}

/** Show the selected value without allowing changes. */
export function RatingReadOnly(): JSX.Element {
  return (
    <RatingGroup.Root readOnly count={5} defaultValue={3} size="sm">
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  );
}

/** Reuse an external rating store. */
export function RatingStore(): JSX.Element {
  const store = useRatingGroup({ count: 5, defaultValue: 3 });
  return (
    <RatingGroup.RootProvider value={store} size="sm">
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.RootProvider>
  );
}

/** Place a visible label before the rating control. */
export function RatingLabel(): JSX.Element {
  return (
    <RatingGroup.Root count={5} defaultValue={3} size="sm" class="example-rating-group-label">
      <RatingGroup.HiddenInput />
      <RatingGroup.Label>Rating</RatingGroup.Label>
      <RatingGroup.Control />
    </RatingGroup.Root>
  );
}
