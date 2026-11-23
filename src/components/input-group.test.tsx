import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { Input, InputGroup } from '../index';

/** Preserve native input behavior while composing elements and joined addons. */
function verifiesComposition(): void {
  let received: HTMLDivElement | undefined;

  /** Receive the group's native element through its public ref. */
  function capture(element: HTMLDivElement): void {
    received = element;
  }

  render(
    /** Mount the full convenience composition through the package entry. */
    () => (
      <>
        <InputGroup
          ref={capture}
          data-testid="input-group"
          startAddon="https://"
          startAddonProps={{ title: 'Protocol' }}
          startElement="@"
          startElementProps={{ title: 'User marker' }}
          endElement=".com"
          endElementProps={{ title: 'Domain ending' }}
          endAddon="USD"
          endAddonProps={{ title: 'Currency' }}
        >
          <Input aria-label="Website" defaultValue="example" />
        </InputGroup>
      </>
    ),
  );

  const group = screen.getByTestId('input-group');
  const input = screen.getByRole('textbox', { name: 'Website' }) as HTMLInputElement;
  expect(group).toBe(received);
  expect(group.className).toContain('lui-input-group');
  expect(group.querySelectorAll('.lui-input-addon')).toHaveLength(2);
  expect(group.querySelectorAll('.lui-input-element')).toHaveLength(2);
  expect(screen.getByTitle('User marker').getAttribute('data-lui-group-auto-skip')).toBe('');
  expect(screen.getByTitle('Protocol').getAttribute('data-lui-group-item')).toBe('');
  expect(screen.getByTitle('Domain ending').getAttribute('data-lui-group-auto-skip')).toBe('');
  expect(input.hasAttribute('startElement')).toBe(false);
  expect(input.className).toContain('lui-input');
  fireEvent.input(input, { target: { value: 'updated' } });
  expect(input.value).toBe('updated');
}

test('Input Group composes native inputs, elements, and addons', verifiesComposition);

/** Keep group padding live without remounting or overruling native style. */
function verifiesReactivePadding(): void {
  const [adorned, setAdorned] = createSignal(true);
  const [offset, setOffset] = createSignal('0px');

  /** Render a changing group beside an input with explicit padding. */
  function Example(): JSX.Element {
    return (
      <>
        <InputGroup startElement={adorned() ? '@' : undefined} startOffset={offset()}>
          <Input aria-label="Reactive field" />
        </InputGroup>
        <InputGroup startElement="@" startOffset={offset()}>
          <Input aria-label="Explicit field" style={{ 'padding-inline-start': '2rem' }} />
        </InputGroup>
      </>
    );
  }

  render(
    /** Keep both controls under the same changing signals. */
    () => <Example />,
  );
  const reactive = screen.getByRole('textbox', { name: 'Reactive field' });
  const explicit = screen.getByRole('textbox', { name: 'Explicit field' });
  const group = reactive.closest('.lui-input-group') as HTMLElement;
  const firstOffset = group.style.getPropertyValue('--lui-private-input-group-start-offset');
  expect(group).toHaveAttribute('data-group-start', '');
  expect(explicit.style.paddingInlineStart).toBe('2rem');
  setOffset('4px');
  flush();
  expect(group.style.getPropertyValue('--lui-private-input-group-start-offset')).not.toBe(
    firstOffset,
  );
  expect(explicit.style.paddingInlineStart).toBe('2rem');
  setAdorned(false);
  flush();
  expect(screen.getByRole('textbox', { name: 'Reactive field' })).toBe(reactive);
  expect(group).not.toHaveAttribute('data-group-start');
  expect(explicit.style.paddingInlineStart).toBe('2rem');
}

test('Input Group updates computed padding and respects explicit padding', verifiesReactivePadding);

/** Reject absent or multiple fields in a mounted Solid application. */
function verifiesSingleChildContract(): void {
  expect(() =>
    render(
      /** Mount a group without the required field. */
      () => (
        <>
          <InputGroup>{undefined}</InputGroup>
        </>
      ),
    ),
  ).toThrow('InputGroup requires exactly one field child.');
  expect(() =>
    render(
      /** Reject text that resembles markup but is not a native field. */
      () => (
        <>
          <InputGroup>{'<input>'}</InputGroup>
        </>
      ),
    ),
  ).toThrow('InputGroup requires exactly one field child.');
  expect(() =>
    render(
      /** Mount two fields under one group. */
      () => (
        <>
          <InputGroup>
            <Input aria-label="First field" />
            <Input aria-label="Second field" />
          </InputGroup>
        </>
      ),
    ),
  ).toThrow('InputGroup requires exactly one field child.');
}

test('Input Group requires exactly one mounted field', verifiesSingleChildContract);

/** Keep the one-field contract when Solid replaces reactive children. */
function verifiesReactiveChildCount(): void {
  const [duplicate, setDuplicate] = createSignal(false);

  /** Switch between one field and two fields under the same group. */
  function Example(): JSX.Element {
    return (
      <>
        <InputGroup>
          {duplicate() ? (
            [<Input aria-label="First" />, <Input aria-label="Second" />]
          ) : (
            <Input aria-label="Only" />
          )}
        </InputGroup>
      </>
    );
  }

  render(
    /** Mount the initially valid reactive group. */
    () => <Example />,
  );
  expect(screen.getByRole('textbox', { name: 'Only' })).toBeTruthy();
  // Solid 2 applies the write on flush, where the invalid child count is reported.
  setDuplicate(true);
  expect(() => flush()).toThrow('InputGroup requires exactly one field child.');
}

test('Input Group validates reactive field replacement', verifiesReactiveChildCount);
