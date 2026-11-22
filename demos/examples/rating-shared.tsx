import { type JSX } from '@solidjs/web';
import { RatingGroup } from '../../src';

/** Render the native form input and default star controls. */
export function RatingExampleControls(): JSX.Element {
  return (
    <>
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </>
  );
}
