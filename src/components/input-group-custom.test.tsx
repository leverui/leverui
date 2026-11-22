import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { InputGroup } from '../index';

/** Let a native custom field receive live padding through the group CSS contract. */
function verifiesCustomChild(): void {
  const [offset, setOffset] = createSignal('0px');

  /** Mark a consumer-owned field and publish its native height to CSS. */
  function CustomField(): JSX.Element {
    return (
      <input
        class="leverui-input-group__field"
        aria-label="Custom field"
        style={{ height: '40px', '--leverui-input-group-field-height': '40px' }}
      />
    );
  }

  render(
    /** Mount a custom field beneath the group context. */
    () => (
      <>
        <InputGroup startElement="@" startOffset={offset()}>
          <CustomField />
        </InputGroup>
      </>
    ),
  );
  const input = screen.getByRole('textbox', { name: 'Custom field' });
  const group = input.closest('.leverui-input-group') as HTMLElement;
  const firstOffset = group.style.getPropertyValue('--leverui-private-input-group-start-offset');
  expect(input.className).toContain('leverui-input-group__field');
  setOffset('3px');
  flush();
  expect(screen.getByRole('textbox', { name: 'Custom field' })).toBe(input);
  expect(group.style.getPropertyValue('--leverui-private-input-group-start-offset')).not.toBe(
    firstOffset,
  );
}

test('Input Group exposes live child padding to custom Solid fields', verifiesCustomChild);
