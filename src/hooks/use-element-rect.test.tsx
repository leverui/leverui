import { flush } from 'solid-js';
import { cleanup, render, screen } from '@solidjs/testing-library';
import { afterEach, expect, test, vi } from 'vitest';
import { EnvironmentProvider } from '../components/environment';
import { useElementRect, type UseElementRectReturn } from './use-element-rect';

let notifyResize: (() => void) | undefined;
let observed: Element | undefined;
let disconnectCount = 0;

/** Supply deterministic resize notifications for the observed element. */
class TestResizeObserver implements ResizeObserver {
  /** Capture the callback for a test-triggered resize. */
  constructor(callback: ResizeObserverCallback) {
    notifyResize =
      /** Publish a resize through the browser observer contract. */
      () => callback([], this);
  }

  /** Record the element passed to the observer. */
  observe(target: Element): void {
    observed = target;
  }

  /** Record individual unobservations when used. */
  unobserve(): void {
    observed = undefined;
  }

  /** Record release of an observer on cleanup. */
  disconnect(): void {
    disconnectCount++;
  }
}

afterEach(
  /** Restore DOM and browser stubs between hook tests. */
  () => {
    cleanup();
    vi.unstubAllGlobals();
    notifyResize = undefined;
    observed = undefined;
    disconnectCount = 0;
  },
);

/** Verify measurement updates and observer cleanup through a Solid ref. */
function verifiesElementRect(): void {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  let measurement: UseElementRectReturn | undefined;

  /** Render the current observed width next to its element. */
  function Example() {
    measurement = useElementRect();
    return (
      <>
        <div ref={measurement.ref} data-testid="measured" />
        <span>{measurement.rect()?.width ?? 'pending'}</span>
      </>
    );
  }

  const view = render(
    /** Supply an explicit document root for the browser observer. */
    () => (
      <EnvironmentProvider value={document}>
        <Example />
      </EnvironmentProvider>
    ),
  );
  const element = screen.getByTestId('measured');
  expect(observed).toBe(element);
  expect(screen.getByText('pending')).toBeTruthy();
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 120 }));
  notifyResize?.();
  flush();
  expect(screen.getByText('120')).toBeTruthy();
  if (!measurement) throw new Error('The element measurement did not mount.');
  const replacement = document.createElement('div');
  measurement.ref(replacement);
  flush();
  expect(observed).toBe(replacement);
  expect(screen.getByText('pending')).toBeTruthy();
  expect(disconnectCount).toBe(1);
  view.unmount();
  expect(disconnectCount).toBe(2);
}

test('useElementRect observes and releases the current element', verifiesElementRect);

/** Verify the observer is taken from the selected document's window. */
function verifiesCustomEnvironment(): void {
  const frame = document.createElement('iframe');
  document.body.append(frame);
  const frameWindow = frame.contentWindow;
  const frameDocument = frame.contentDocument;
  if (!frameWindow || !frameDocument) throw new Error('The iframe did not create a document.');
  Object.defineProperty(frameWindow, 'ResizeObserver', {
    configurable: true,
    value: TestResizeObserver,
  });

  /** Observe an element within the selected environment context. */
  function Example() {
    const measurement = useElementRect();
    return <div ref={measurement.ref} data-testid="frame-measured" />;
  }

  render(
    /** Select the iframe document as the hook's environment. */
    () => (
      <EnvironmentProvider value={frameDocument}>
        <Example />
      </EnvironmentProvider>
    ),
  );
  expect(observed).toBe(screen.getByTestId('frame-measured'));
  frame.remove();
}

test('useElementRect uses the selected environment window', verifiesCustomEnvironment);
