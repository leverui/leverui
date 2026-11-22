import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Editable, useEditable } from '../index';

afterEach(cleanup);

/** Keep inherited CSS defaults reactive around an external Editable machine. */
function verifiesCallerOwnedDefaults(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const [unstyled, setUnstyled] = createSignal(false);

  /** Own the machine independently from the presentation defaults. */
  function Example(): JSX.Element {
    const machine = useEditable({ defaultValue: 'External value' });
    return (
      <>
        <Editable.PropsProvider
          value={() => ({ size: size(), unstyled: unstyled(), disabled: true })}
        >
          <Editable.RootProvider value={machine} data-testid="external-editable-root">
            <Editable.Preview data-testid="external-editable-preview" />
            <Editable.Input data-testid="external-editable-input" />
          </Editable.RootProvider>
        </Editable.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the same external machine for each defaults update. */
    () => <Example />,
  );
  const root = screen.getByTestId('external-editable-root');
  const preview = screen.getByTestId('external-editable-preview');
  const input = screen.getByTestId('external-editable-input') as HTMLInputElement;
  expect(root.getAttribute('data-size')).toBe('sm');
  expect(preview.textContent).toBe('External value');
  expect(input.disabled).toBe(false);
  expect(root.hasAttribute('disabled')).toBe(false);

  setSize('lg');
  flush();
  expect(root.getAttribute('data-size')).toBe('lg');

  setUnstyled(true);
  flush();
  expect(root.hasAttribute('data-unstyled')).toBe(true);
  expect(preview.hasAttribute('data-unstyled')).toBe(true);
  expect(root.hasAttribute('disabled')).toBe(false);
  expect(input.disabled).toBe(false);
}

it('applies reactive presentation defaults to caller-owned roots', verifiesCallerOwnedDefaults);
