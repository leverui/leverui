import { render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { Spinner, SpinnerPropsProvider } from '../index';

// Solid 2 removed the `on:` event namespace. Handlers are camelCase props, and
// native listener options are set from a ref callback.

/** Compose provider and instance click handlers on the native Spinner element. */
function verifiesComposedSpinnerEvents(): void {
  const calls: string[] = [];
  const targets: EventTarget[] = [];

  /** Record the handler supplied by the defaults provider. */
  function providerClick(event: MouseEvent): void {
    calls.push('provider');
    if (event.currentTarget) targets.push(event.currentTarget);
  }

  /** Record the handler supplied by the Spinner instance. */
  function instanceClick(event: MouseEvent): void {
    calls.push('instance');
    if (event.currentTarget) targets.push(event.currentTarget);
  }

  render(
    /** Mount both handlers on the same native Spinner element. */
    () => (
      <SpinnerPropsProvider value={{ onClick: providerClick }}>
        <Spinner data-testid="composed-event-spinner" onClick={instanceClick} />
      </SpinnerPropsProvider>
    ),
  );

  const spinner = screen.getByTestId('composed-event-spinner');
  spinner.click();
  expect(calls).toEqual(['provider', 'instance']);
  expect(targets).toEqual([spinner, spinner]);
}

it('composes click handlers from provider and instance', verifiesComposedSpinnerEvents);

/** Attach a native listener with options through the Spinner's ref. */
function verifiesRefListenerOptions(): void {
  let calls = 0;

  /** Count clicks delivered through a once-only native listener. */
  function handleClick(): void {
    calls += 1;
  }

  /** Add the listener with its options when Solid creates the element. */
  function listenOnce(element: HTMLElement): void {
    element.addEventListener('click', handleClick, { once: true });
  }

  render(
    /** Mount the Spinner with a ref-attached listener. */
    () => <Spinner data-testid="once-spinner" ref={listenOnce} />,
  );

  const spinner = screen.getByTestId('once-spinner');
  spinner.click();
  spinner.click();
  expect(calls).toBe(1);
}

it('passes the native element to a ref that sets listener options', verifiesRefListenerOptions);
