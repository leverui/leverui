import { fireEvent, render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Button } from '../index';

/** Verify a native click reaches a consumer handler on a styled Button. */
function verifiesButtonClick(): void {
  let clicks = 0;

  /** Count one native activation from the styled action. */
  function countClick(): void {
    clicks += 1;
  }

  /** Render the action with its click handler. */
  function Example(): JSX.Element {
    return (
      <>
        <Button onClick={countClick}>Activate</Button>
      </>
    );
  }

  render(
    /** Mount the action in Solid's tracked JSX scope. */
    () => <Example />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Activate' }));
  expect(clicks).toBe(1);
}

it('forwards a native click handler', verifiesButtonClick);
