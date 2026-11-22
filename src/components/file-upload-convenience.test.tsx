import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { FileUpload } from '../index';

afterEach(cleanup);

/** Keep cached list children reactive to display and action props. */
function verifiesReactiveListParts(): void {
  const file = new File(['report'], 'notes.txt', { type: 'text/plain' });
  const [showSize, setShowSize] = createSignal(false);
  const [clearable, setClearable] = createSignal(false);

  /** Bind the public convenience list to changing caller props. */
  function Example(): JSX.Element {
    return (
      <>
        <FileUpload.Root defaultAcceptedFiles={[file]}>
          <FileUpload.List showSize={showSize()} clearable={clearable()} />
        </FileUpload.Root>
      </>
    );
  }

  render(
    /** Mount the reactive public list inside its machine context. */
    () => <Example />,
  );
  expect(screen.queryByText('6 byte')).toBeNull();
  expect(document.querySelector('[data-file-upload-item-delete-trigger]')).toBeNull();
  setShowSize(true);
  flush();
  setClearable(true);
  flush();
  expect(screen.getByText('6 byte')).toBeTruthy();
  expect(document.querySelector('[data-file-upload-item-delete-trigger]')).not.toBeNull();
}

it('updates standard item parts when list props change', verifiesReactiveListParts);
