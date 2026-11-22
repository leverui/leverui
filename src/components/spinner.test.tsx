import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Spinner, SpinnerPropsProvider, type SpinnerProps } from '../index';

type GetSpinnerChildProps = Parameters<NonNullable<SpinnerProps['asChild']>>[0];

/** Preserve native span attributes without inserted ARIA. */
function verifiesNativeSpinner(): void {
  let received: HTMLSpanElement | undefined;

  /** Save the native span supplied to the consumer. */
  function capture(element: HTMLSpanElement): void {
    received = element;
  }

  render(
    /** Mount default and explicitly named Spinners without a styling provider. */
    () => (
      <>
        <Spinner ref={capture} data-testid="default-spinner" />
        <Spinner role="status" aria-label="Loading results" data-testid="named-spinner" />
      </>
    ),
  );

  const spinner = screen.getByTestId('default-spinner');
  expect(spinner).toBe(received);
  expect(spinner.tagName).toBe('SPAN');
  expect(spinner.hasAttribute('role')).toBe(false);
  expect(spinner.hasAttribute('aria-label')).toBe(false);
  expect(screen.getByRole('status', { name: 'Loading results' })).toBe(
    screen.getByTestId('named-spinner'),
  );
}

it('keeps native Spinner semantics and consumer-owned ARIA', verifiesNativeSpinner);

/** Preserve reactive defaults and compose provider and instance props. */
function verifiesSpinnerDefaults(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const calls: string[] = [];

  /** Record the provider's bound native event. */
  function providerClick(label: string): void {
    calls.push(label);
  }

  /** Record the instance event after the provider has run. */
  function instanceClick(): void {
    calls.push('instance');
  }

  /** Keep provider values live while one Spinner selects its own size. */
  function Example(): JSX.Element {
    return (
      <SpinnerPropsProvider
        value={{
          size: size(),
          class: 'provider-spinner',
          style: { color: 'red', 'border-width': '1px' },
          onClick: [providerClick, 'provider'],
        }}
      >
        <Spinner
          data-testid="inherited-spinner"
          class="instance-spinner"
          style={{ color: 'blue' }}
          onClick={instanceClick}
        />
        <Spinner data-testid="fixed-spinner" size="xs" />
      </SpinnerPropsProvider>
    );
  }

  render(
    /** Mount the signal-driven Spinner provider. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited-spinner');
  const fixed = screen.getByTestId('fixed-spinner');
  const originalClass = inherited.className;
  const fixedClass = fixed.className;
  expect(inherited.className).toContain('provider-spinner instance-spinner');
  expect(inherited).toHaveAttribute('data-size', 'sm');
  expect(inherited.style.color).toBe('blue');
  expect(inherited.style.borderWidth).toBe('1px');
  inherited.click();
  expect(calls).toEqual(['provider', 'instance']);

  setSize('lg');
  flush();
  expect(inherited).toHaveAttribute('data-size', 'lg');
  expect(inherited.className).toBe(originalClass);
  expect(fixed.className).toBe(fixedClass);
}

it('merges reactive Spinner defaults, native styles, classes, and events', verifiesSpinnerDefaults);

/** Keep alternative rendering and consumer classes available. */
function verifiesSpinnerComposition(): void {
  let selected: HTMLDivElement | undefined;

  /** Receive the selected native div instead of the default span. */
  function captureDiv(element: HTMLDivElement): void {
    selected = element;
  }

  /** Render an icon as the styled Spinner child element. */
  function renderIcon(getProps: GetSpinnerChildProps): JSX.Element {
    return (
      <span {...getProps()} data-testid="icon-spinner">
        ◌
      </span>
    );
  }

  render(
    /** Mount selected, child, and class-customized Spinners. */
    () => (
      <>
        <Spinner as="div" ref={captureDiv} data-testid="div-spinner" />
        <Spinner asChild={renderIcon} />
        <Spinner class="custom-ring" data-testid="custom-spinner" />
      </>
    ),
  );
  expect(screen.getByTestId('div-spinner')).toBe(selected);
  expect(screen.getByTestId('icon-spinner').textContent).toBe('◌');
  expect(screen.getByTestId('custom-spinner').className).toContain('leverui-spinner custom-ring');
}

it('supports polymorphic, child, and class-customized rendering', verifiesSpinnerComposition);
