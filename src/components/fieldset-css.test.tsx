import { cleanup, render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, test } from 'vitest';
import { Fieldset } from '../index';

afterEach(cleanup);

/** Verify unstyled composition retains native props and every public hook. */
function verifiesUnstyledFieldset(): void {
  /** Mount the root and its parts without a styling provider. */
  function Example(): JSX.Element {
    return (
      <Fieldset.Root
        id="unstyled-group"
        unstyled
        class="consumer-group"
        style={{ '--consumer-gap': '1rem' }}
        data-testid="unstyled-group"
      >
        <Fieldset.Legend data-testid="unstyled-legend">Account</Fieldset.Legend>
        <Fieldset.HelperText data-testid="unstyled-helper">Help</Fieldset.HelperText>
        <Fieldset.Content data-testid="unstyled-content">Controls</Fieldset.Content>
      </Fieldset.Root>
    );
  }

  render(Example);
  const root = screen.getByTestId('unstyled-group');
  expect(root).toHaveAttribute('data-unstyled', '');
  expect(root).toHaveClass('lui-fieldset__root', 'consumer-group');
  expect(root).toHaveStyle('--consumer-gap: 1rem');
  for (const part of ['legend', 'helper', 'content']) {
    expect(screen.getByTestId(`unstyled-${part}`)).toHaveAttribute('data-unstyled', '');
  }
  expect(screen.getByTestId('unstyled-legend')).toHaveClass('lui-fieldset__legend');
  expect(screen.getByTestId('unstyled-helper')).toHaveClass('lui-fieldset__helperText');
  expect(screen.getByTestId('unstyled-content')).toHaveClass('lui-fieldset__content');
}

test('unstyled Fieldset keeps native and part contracts', verifiesUnstyledFieldset);
