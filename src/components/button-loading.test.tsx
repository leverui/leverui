import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Button } from '../index';
import type { GetChildProps } from '../styled-system/child-props';

/** Forward the Button's children into a linked child element. */
function renderButtonLink(getProps: GetChildProps): JSX.Element {
  return <a {...getProps()} href="/save" />;
}

/** Keep the ordinary label visible while loading state changes reactively. */
function verifiesButtonContent(): void {
  const [loading, setLoading] = createSignal(false);

  /** Render one Button whose loading state can change without remounting it. */
  function Example(): JSX.Element {
    return (
      <>
        <Button loading={loading()} loadingText="Saving">
          Save
        </Button>
      </>
    );
  }

  render(Example);
  const button = screen.getByRole('button', { name: 'Save' });
  expect(button.textContent).toBe('Save');
  expect(button.hasAttribute('disabled')).toBe(false);
  expect(button.querySelector('[aria-hidden="true"]')).toBeNull();
  expect([...button.classList]).toEqual(['leverui-button']);

  setLoading(true);
  flush();
  expect(screen.getByRole('button', { name: 'Saving' })).toBe(button);
  expect(button.hasAttribute('disabled')).toBe(true);
  expect(button.hasAttribute('aria-busy')).toBe(false);

  setLoading(false);
  flush();
  expect(screen.getByRole('button', { name: 'Save' })).toBe(button);
  expect(button.textContent).toBe('Save');
  expect(button.hasAttribute('disabled')).toBe(false);
  expect(button.querySelector('[aria-hidden="true"]')).toBeNull();
}

it('renders the label until loading starts and restores it afterward', verifiesButtonContent);

/** Keep child content when a loading Button uses the asChild render path. */
function verifiesLoadingAsChild(): void {
  const [loading, setLoading] = createSignal(true);

  /** Render a linked Button while its loading state changes. */
  function Example(): JSX.Element {
    return (
      <>
        <Button asChild={renderButtonLink} loading={loading()} loadingText="Saving">
          Save
        </Button>
      </>
    );
  }

  render(Example);
  const link = screen.getByRole('link', { name: 'Save' });
  expect(link.textContent).toBe('Save');
  expect(link.querySelector('[role="status"]')).toBeNull();
  expect(screen.queryByText('Saving')).toBeNull();

  setLoading(false);
  flush();
  expect(screen.getByRole('link', { name: 'Save' })).toBe(link);
  expect(link.textContent).toBe('Save');
}

it('preserves forwarded child content while loading with asChild', verifiesLoadingAsChild);
