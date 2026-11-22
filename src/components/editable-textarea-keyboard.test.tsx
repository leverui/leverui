import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Editable } from '../index';

afterEach(cleanup);

/** Mount a multiline editor and expose its current editing state. */
function Example(): JSX.Element {
  return (
    <>
      <Editable.Root defaultEdit defaultValue="Before">
        <Editable.Context>
          {
            /** Observe whether Zag accepts native keyboard actions. */
            (editable) => (
              <output data-testid="textarea-editing">{String(editable().editing)}</output>
            )
          }
        </Editable.Context>
        <Editable.Textarea data-testid="keyboard-textarea" />
      </Editable.Root>
    </>
  );
}

/** Keep Escape connected to Zag's multiline cancel action. */
async function verifiesTextareaEscape(): Promise<void> {
  render(
    /** Create the machine with editing active from the first render. */
    () => <Example />,
  );
  const textarea = screen.getByTestId('keyboard-textarea');
  expect(screen.getByTestId('textarea-editing').textContent).toBe('true');
  fireEvent.keyDown(textarea, { key: 'Escape' });
  await waitFor(
    /** Observe the native key's effect on the machine. */
    () => expect(screen.getByTestId('textarea-editing').textContent).toBe('false'),
  );
}

it('cancels multiline editing with Escape', verifiesTextareaEscape);

/** Keep modified Enter connected to Zag's multiline submit action. */
async function verifiesTextareaSubmit(): Promise<void> {
  render(
    /** Create a fresh machine for the submit path. */
    () => <Example />,
  );
  const textarea = screen.getByTestId('keyboard-textarea');
  fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true, metaKey: true });
  await waitFor(
    /** Either platform modifier should reach Zag in this synthetic event. */
    () => expect(screen.getByTestId('textarea-editing').textContent).toBe('false'),
  );
}

it('submits multiline editing with modified Enter', verifiesTextareaSubmit);
