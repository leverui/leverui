import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Text, TextPropsProvider } from '../index';

/** Keep native provider defaults reactive without replacing the paragraph. */
function verifiesReactiveTextDefaults(): void {
  const [alternate, setAlternate] = createSignal(false);
  const events: string[] = [];

  /** Record the inherited native event first. */
  function recordProviderClick(): void {
    events.push('provider');
  }

  /** Record the explicit instance event after its default. */
  function recordInstanceClick(): void {
    events.push('instance');
  }

  /** Mount one Text instance under changing native defaults. */
  function Example(): JSX.Element {
    return (
      <TextPropsProvider
        value={{
          class: 'provider-copy',
          style: { color: alternate() ? 'blue' : 'red' },
          onClick: recordProviderClick,
        }}
      >
        <Text class="instance-copy" style={{ 'font-weight': 'bold' }} onClick={recordInstanceClick}>
          Reactive text
        </Text>
      </TextPropsProvider>
    );
  }

  render(
    /** Create the provider and paragraph in one Solid owner. */
    () => <Example />,
  );
  const paragraph = screen.getByText('Reactive text');
  expect(paragraph.tagName).toBe('P');
  expect(paragraph.className).toContain('leverui-text');
  expect(paragraph.className).toContain('provider-copy');
  expect(paragraph.className).toContain('instance-copy');
  expect(paragraph.getAttribute('style')).toContain('color: red');
  expect(paragraph.getAttribute('style')).toContain('font-weight: bold');
  fireEvent.click(paragraph);
  expect(events).toEqual(['provider', 'instance']);
  setAlternate(true);
  flush();
  expect(screen.getByText('Reactive text')).toBe(paragraph);
  expect(paragraph.getAttribute('style')).toContain('color: blue');
}

it('merges reactive native Text defaults, styles, and events', verifiesReactiveTextDefaults);

/** Reject invalid scalar clamps before they reach authored CSS. */
function verifiesInvalidClamp(): void {
  /** Attempt to mount an unsupported negative line count. */
  function mountInvalid(): void {
    render(
      /** Keep the invalid value at the public component boundary. */
      () => <Text lineClamp={-2}>Invalid clamp</Text>,
    );
  }

  expect(mountInvalid).toThrow(/positive integer/);
}

it('rejects invalid Text line clamps', verifiesInvalidClamp);
