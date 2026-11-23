import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { describe, expect, it } from 'vitest';
import { Box, Button, Spinner } from '../index';
import type { GetChildProps } from '../styled-system/child-props';

/** Count one class name without treating substrings as matches. */
function countClass(classes: string[], target: string): number {
  let count = 0;
  for (const name of classes) if (name === target) count += 1;
  return count;
}

/** Render an anchor with its Box parent's merged attributes. */
function renderHelpLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="/help">
      Help
    </a>
  );
}

/** Verify native Box attributes and consumer classes reach the same element. */
function verifiesBox(): void {
  /** Render a class-only Box with native attributes. */
  function renderBox(): JSX.Element {
    return (
      <Box data-testid="box" class="consumer-box-test" aria-label="Content panel">
        Content
      </Box>
    );
  }

  render(renderBox);
  const box = screen.getByTestId('box');
  expect(box.tagName).toBe('DIV');
  expect(box.textContent).toBe('Content');
  expect([...box.classList]).toEqual(['lui-box', 'consumer-box-test']);
  expect(box.getAttribute('aria-label')).toBe('Content panel');
}

/** Verify the loading Button's native and accessible state. */
function verifiesButtonLoading(): void {
  /** Render a loading Button with native disabled behavior. */
  function renderButton(): JSX.Element {
    return (
      <Button loading loadingText="Saving">
        Save
      </Button>
    );
  }

  render(renderButton);
  const button = screen.getByRole('button', { name: 'Saving' });
  expect(button.getAttribute('type')).toBe('button');
  expect(button.hasAttribute('disabled')).toBe(true);
  expect(button.hasAttribute('aria-busy')).toBe(false);
  expect(button.className).toContain('lui-button');
}

/** Verify native, alias, and stable classes appear once. */
function verifiesComponentClasses(): void {
  /** Render Button and Spinner with overlapping class names. */
  function renderClasses(): JSX.Element {
    return (
      <>
        <Button
          data-testid="class-button"
          class="native-button"
          {...{ className: 'alias-button lui-button' }}
        >
          Save
        </Button>
        <Spinner
          data-testid="class-spinner"
          class="native-spinner"
          {...{ className: 'alias-spinner lui-spinner' }}
        />
      </>
    );
  }

  render(renderClasses);
  const buttonClasses = screen.getByTestId('class-button').className.split(/\s+/);
  const spinnerClasses = screen.getByTestId('class-spinner').className.split(/\s+/);
  expect(buttonClasses).toEqual(
    expect.arrayContaining(['lui-button', 'native-button', 'alias-button']),
  );
  expect(spinnerClasses).toEqual(
    expect.arrayContaining(['lui-spinner', 'native-spinner', 'alias-spinner']),
  );
  expect(countClass(buttonClasses, 'alias-button')).toBe(1);
  expect(countClass(spinnerClasses, 'alias-spinner')).toBe(1);
  expect(countClass(buttonClasses, 'lui-button')).toBe(1);
  expect(countClass(spinnerClasses, 'lui-spinner')).toBe(1);
}

/** Verify a consumer class composes with Button's stable hook. */
function verifiesConsumerClass(): void {
  /** Render Button with a consumer CSS class. */
  function renderButton(): JSX.Element {
    return (
      <Button data-testid="custom-button" class="custom-button">
        Save
      </Button>
    );
  }

  render(renderButton);
  expect(screen.getByTestId('custom-button').className).toContain('lui-button');
  expect(screen.getByTestId('custom-button').className).toContain('custom-button');
}

/** Verify a native Box keeps its node while a consumer class changes. */
function verifiesReactiveStyles(): void {
  const [padding, setPadding] = createSignal<'4' | '8'>('4');

  /** Read the padding signal while rendering the Box. */
  function renderReactiveBox(): JSX.Element {
    return (
      <Box
        data-testid="reactive-box"
        class={padding() === '4' ? 'consumer-padding-4' : 'consumer-padding-8'}
      />
    );
  }

  render(renderReactiveBox);
  const box = screen.getByTestId('reactive-box');
  const initialClass = box.className;
  setPadding('8');
  flush();
  expect(box.className).not.toBe(initialClass);
  expect(screen.getByTestId('reactive-box')).toBe(box);
  expect(box.classList.contains('consumer-padding-8')).toBe(true);
}

/** Verify an asChild element receives its parent's class and native behavior. */
function verifiesAsChildStyling(): void {
  /** Render a class-only Box as an anchor. */
  function renderLink(): JSX.Element {
    return <Box class="consumer-help-link" asChild={renderHelpLink} />;
  }

  render(renderLink);
  const link = screen.getByRole('link', { name: 'Help' });
  expect(link.getAttribute('href')).toBe('/help');
  expect(link.classList.contains('lui-box')).toBe(true);
  expect(link.classList.contains('consumer-help-link')).toBe(true);
}

/** Register the foundation's component checks. */
function defineComponentTests(): void {
  it('renders Box with native HTML attributes and consumer classes', verifiesBox);
  it('renders button defaults and loading state', verifiesButtonLoading);
  it('preserves native and alias classes once on Button and Spinner', verifiesComponentClasses);
  it('composes consumer classes with stable Lever UI hooks', verifiesConsumerClass);
  it('updates Box classes when a Solid signal changes', verifiesReactiveStyles);
  it('forwards Box classes through a Solid render prop', verifiesAsChildStyling);
}

describe('Solid component foundation', defineComponentTests);
