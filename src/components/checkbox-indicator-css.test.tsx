import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { CheckboxControl, CheckboxHiddenInput, CheckboxRoot } from '../index';

afterEach(cleanup);

/** Verify the native SVG follows the primitive state through stable CSS hooks. */
async function verifiesIndicatorState(): Promise<void> {
  render(
    /** Mount the default indicator with its native checkbox input. */
    () => (
      <>
        <CheckboxRoot name="choice" unstyled>
          <CheckboxControl />
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </>
    ),
  );
  const input = screen.getByRole('checkbox') as HTMLInputElement;
  const indicator = document.querySelector('.lui-checkbox__indicator');
  expect(indicator?.tagName.toLowerCase()).toBe('svg');
  expect(indicator?.getAttribute('data-unstyled')).toBe('');
  expect(indicator?.getAttribute('data-state')).toBe('unchecked');
  expect(indicator?.querySelectorAll('[data-glyph]')).toHaveLength(2);
  expect(indicator?.getAttribute('style')).toBeNull();
  fireEvent.click(input);
  await waitFor(
    /** Observe the primitive's transition on the same SVG element. */
    () => expect(indicator?.getAttribute('data-state')).toBe('checked'),
  );
  expect(document.querySelector('.lui-checkbox__indicator')).toBe(indicator);
}

it('keeps the default SVG and glyph hooks through checked changes', verifiesIndicatorState);
