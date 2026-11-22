import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { InputElement, type InputElementProps } from '../index';

type GetChildProps = Parameters<NonNullable<InputElementProps['asChild']>>[0];

/** Keep default markup native and placement out of DOM attributes. */
function verifiesNativeElement(): void {
  let received: HTMLDivElement | undefined;

  /** Capture the native element exposed through the public ref. */
  function capture(element: HTMLDivElement): void {
    received = element;
  }

  render(
    /** Mount the element in a theme provider. */
    () => (
      <>
        <InputElement ref={capture} placement="start" title="Protocol">
          https://
        </InputElement>
      </>
    ),
  );

  const element = screen.getByTitle('Protocol');
  expect(element).toBe(received);
  expect(element.tagName).toBe('DIV');
  expect(element.textContent).toBe('https://');
  expect(element.className).toContain('leverui-input-element');
  expect(element.hasAttribute('placement')).toBe(false);
}

test('Input Element forwards native attributes and its div ref', verifiesNativeElement);

/** Follow placement changes without replacing the adornment node. */
function verifiesReactivePlacement(): void {
  const [placement, setPlacement] = createSignal<'start' | 'end'>('start');

  /** Keep the changing placement in the same component owner. */
  function Example(): JSX.Element {
    return (
      <>
        <InputElement placement={placement()} data-testid="reactive-element">
          Unit
        </InputElement>
        <InputElement unstyled data-testid="unstyled-element">
          Plain
        </InputElement>
      </>
    );
  }

  render(
    /** Mount both element states for comparison. */
    () => <Example />,
  );
  const element = screen.getByTestId('reactive-element');
  const firstClass = element.className;
  expect(element.getAttribute('data-placement')).toBe('start');
  setPlacement('end');
  flush();
  expect(screen.getByTestId('reactive-element')).toBe(element);
  expect(element.className).toBe(firstClass);
  expect(element.getAttribute('data-placement')).toBe('end');
  expect(screen.getByTestId('unstyled-element').className).toContain('leverui-input-element');
}

test('Input Element responds to placement changes', verifiesReactivePlacement);

/** Preserve the selected native tag and Solid child-render composition. */
function verifiesSelectedElement(): void {
  let span: HTMLSpanElement | undefined;

  /** Capture the selected span without a ref adapter. */
  function capture(element: HTMLSpanElement): void {
    span = element;
  }

  /** Forward received native props to a child owned by the consumer. */
  function renderChild(getProps: GetChildProps): JSX.Element {
    return (
      <strong {...getProps()} data-testid="child-element">
        Required
      </strong>
    );
  }

  render(
    /** Mount both supported element-selection paths. */
    () => (
      <>
        <InputElement as="span" ref={capture} data-testid="span-element">
          Span
        </InputElement>
        <InputElement asChild={renderChild} />
      </>
    ),
  );

  expect(screen.getByTestId('span-element')).toBe(span);
  expect(span?.tagName).toBe('SPAN');
  expect(screen.getByTestId('child-element').tagName).toBe('STRONG');
  expect(screen.getByTestId('child-element').className).toContain('leverui-input-element');
}

test('Input Element supports selected tags and child rendering', verifiesSelectedElement);
