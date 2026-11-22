import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { CheckboxCard } from '../index';

afterEach(cleanup);

/** Preserve machine behavior and refs through caller-rendered card parts. */
async function verifiesChildRenderedCard(): Promise<void> {
  let rootRef: Element | undefined;
  let controlRef: HTMLElement | undefined;
  let labelRef: HTMLElement | undefined;

  /** Capture the selected root's native element. */
  function captureRoot(element: Element): void {
    rootRef = element;
  }

  /** Capture the caller-rendered control element. */
  function captureControl(element: HTMLElement): void {
    controlRef = element;
  }

  /** Capture the caller-rendered label element. */
  function captureLabel(element: HTMLElement): void {
    labelRef = element;
  }

  render(
    /** Keep all custom elements beneath the same primitive machine. */
    () => (
      <>
        <CheckboxCard.Root
          name="choice"
          defaultChecked
          data-testid="card-root"
          ref={captureRoot}
          asChild={
            /** Give the consumer's label the primitive state and stable CSS classes. */
            (getProps) => <label {...getProps()} />
          }
        >
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control
            data-testid="card-control"
            ref={captureControl}
            asChild={
              /** Keep the primitive control attributes on the caller's div. */
              (getProps) => <div {...getProps()} />
            }
          >
            <CheckboxCard.Label
              data-testid="card-label"
              ref={captureLabel}
              asChild={
                /** Keep the accessible label on the caller's span. */
                (getProps) => <span {...getProps()} />
              }
            >
              Custom card
            </CheckboxCard.Label>
            <CheckboxCard.Indicator />
          </CheckboxCard.Control>
        </CheckboxCard.Root>
      </>
    ),
  );

  const root = screen.getByTestId('card-root');
  const control = screen.getByTestId('card-control');
  const label = screen.getByTestId('card-label');
  const input = screen.getByRole('checkbox', { name: 'Custom card' }) as HTMLInputElement;
  expect(rootRef).toBe(root);
  expect(controlRef).toBe(control);
  expect(labelRef).toBe(label);
  expect(root.tagName).toBe('LABEL');
  expect(control.tagName).toBe('DIV');
  expect(label.tagName).toBe('SPAN');
  expect(input.checked).toBe(true);
  fireEvent.click(input);
  await waitFor(
    /** Observe the primitive state after the custom elements receive the native event. */
    () => expect(input.checked).toBe(false),
  );
}

it('preserves card roots, parts, and refs through asChild', verifiesChildRenderedCard);

/** Preserve native input behavior and Indicator props in child-rendered parts. */
async function verifiesChildRenderedInputAndIndicator(): Promise<void> {
  let indicatorRef: SVGSVGElement | undefined;

  /** Capture the custom SVG passed through Checkmark. */
  function captureIndicator(element: SVGSVGElement): void {
    indicatorRef = element;
  }

  render(
    /** Keep both caller-rendered parts under one Card machine. */
    () => (
      <>
        <form data-testid="card-form">
          <CheckboxCard.Root name="plan" value="pro" defaultChecked>
            <CheckboxCard.HiddenInput
              asChild={
                /** Receive the primitive's native checkbox attributes on the selected input. */
                (getProps) => <input {...getProps()} data-testid="custom-input" />
              }
            />
            <CheckboxCard.Control>
              <CheckboxCard.Label>Pro plan</CheckboxCard.Label>
              <CheckboxCard.Indicator
                size="lg"
                aria-hidden="false"
                ref={captureIndicator}
                asChild={
                  /** Receive state and stable CSS classes on the selected SVG. */
                  (getProps) => (
                    <svg
                      {...getProps({ role: 'img', 'aria-label': 'Selection mark' })}
                      data-testid="custom-indicator"
                    />
                  )
                }
              />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </form>
      </>
    ),
  );

  const input = screen.getByTestId('custom-input') as HTMLInputElement;
  const indicator = screen.getByTestId('custom-indicator');
  expect(input.type).toBe('checkbox');
  expect(input.checked).toBe(true);
  expect(input.name).toBe('plan');
  expect(indicatorRef).toBe(indicator);
  expect(indicator.getAttribute('aria-hidden')).toBe('false');
  expect(indicator.getAttribute('aria-label')).toBe('Selection mark');
  expect(indicator.getAttribute('data-state')).toBe('checked');
  expect(indicator.querySelector('polyline')).not.toBeNull();
  expect(Array.from(new FormData(screen.getByTestId('card-form') as HTMLFormElement))).toEqual([
    ['plan', 'pro'],
  ]);
  input.focus();
  expect(document.activeElement).toBe(input);
  fireEvent.click(input);
  await waitFor(
    /** Observe the same native input after the primitive changes its state. */
    () => expect(input.checked).toBe(false),
  );
  await waitFor(
    /** Observe the custom SVG after the Checkbox machine settles. */
    () => expect(indicator.getAttribute('data-state')).toBe('unchecked'),
  );
  expect(screen.getByTestId('custom-indicator')).toBe(indicator);
}

it('preserves child-rendered input and indicator behavior', verifiesChildRenderedInputAndIndicator);
