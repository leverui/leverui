import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Loader, LoaderOverlay } from '../index';

/** Read Loader content order without style element siblings. */
function contentNodes(element: Element): Node[] {
  return Array.from(element.childNodes).filter(
    /** Ignore style elements inserted beside styled descendants. */
    (node) => node.nodeName !== 'STYLE',
  );
}

/** Keep the default indicator and original content in their default structure. */
function verifiesDefaultLoader(): void {
  let wrapper: HTMLSpanElement | undefined;

  /** Receive the Loader's native span while it is visible. */
  function capture(element: HTMLSpanElement): void {
    wrapper = element;
  }

  render(
    /** Mount a visible and a bypassed Loader in one Solid owner. */
    () => (
      <>
        <Loader ref={capture} data-testid="default-loader">
          Submit
        </Loader>
        <Loader visible={false} data-testid="bypassed-loader">
          Ready
        </Loader>
      </>
    ),
  );

  const loader = screen.getByTestId('default-loader');
  expect(loader).toBe(wrapper);
  expect(loader.tagName).toBe('SPAN');
  expect(loader.className).toContain('lui-loader');
  expect(loader.querySelector('.lui-spinner')).not.toBeNull();
  expect(loader.querySelector('div')).not.toBeNull();
  expect(loader.textContent).toContain('Submit');
  expect(screen.queryByTestId('bypassed-loader')).toBeNull();
  expect(screen.getByText('Ready')).toBeDefined();
}

it('keeps default and bypassed Loader structure', verifiesDefaultLoader);

/** Preserve text placement and distinguish an omitted spinner from null. */
function verifiesLoaderContent(): void {
  render(
    /** Mount both placements and a deliberately suppressed indicator. */
    () => (
      <>
        <Loader data-testid="start-loader" text="Loading">
          Submit
        </Loader>
        <Loader data-testid="end-loader" text="Loading" spinnerPlacement="end">
          Submit
        </Loader>
        <Loader data-testid="null-loader" spinner={null}>
          Ready
        </Loader>
        <Loader data-testid="custom-loader" text="Working" spinner={<span>◌</span>}>
          Submit
        </Loader>
      </>
    ),
  );

  const start = screen.getByTestId('start-loader');
  const end = screen.getByTestId('end-loader');
  const suppressed = screen.getByTestId('null-loader');
  expect(contentNodes(start)[0]).toBe(start.querySelector('.lui-spinner'));
  expect(contentNodes(end).at(-1)).toBe(end.querySelector('.lui-spinner'));
  expect(start.textContent).toBe('Loading');
  expect(suppressed.textContent).toBe('Ready');
  expect(suppressed.querySelector('.lui-spinner')).toBeNull();
  expect(screen.getByTestId('custom-loader').textContent).toBe('◌Working');
}

it('respects text placement, custom indicators, and explicit null', verifiesLoaderContent);

/** Keep visibility and placement changes reactive without owning a native state. */
function verifiesReactiveLoader(): void {
  const [visible, setVisible] = createSignal(true);
  const [placement, setPlacement] = createSignal<'start' | 'end'>('start');

  /** Render signal-driven Loader props around a stable child. */
  function Example(): JSX.Element {
    return (
      <>
        <Loader
          data-testid="reactive-loader"
          visible={visible()}
          spinnerPlacement={placement()}
          text="Wait"
        >
          <span data-testid="reactive-child">Ready</span>
        </Loader>
      </>
    );
  }

  render(
    /** Mount the reactive Loader tree. */
    () => <Example />,
  );
  const loader = screen.getByTestId('reactive-loader');
  expect(contentNodes(loader)[0]).toBe(loader.querySelector('.lui-spinner'));
  setPlacement('end');
  flush();
  expect(contentNodes(loader).at(-1)).toBe(loader.querySelector('.lui-spinner'));
  setVisible(false);
  flush();
  expect(screen.queryByTestId('reactive-loader')).toBeNull();
  expect(screen.getByTestId('reactive-child').textContent).toBe('Ready');
}

it('updates Loader visibility and placement reactively', verifiesReactiveLoader);

/** Forward selected native refs and keep LoaderOverlay as a separate div. */
function verifiesLoaderOverlay(): void {
  let selected: HTMLDivElement | undefined;
  let overlay: HTMLDivElement | undefined;

  /** Receive the Loader's selected native div. */
  function captureSelected(element: HTMLDivElement): void {
    selected = element;
  }

  /** Receive the overlay's native div. */
  function captureOverlay(element: HTMLDivElement): void {
    overlay = element;
  }

  render(
    /** Mount polymorphic Loader and overlay paths. */
    () => (
      <>
        <Loader as="div" ref={captureSelected} text="Working" data-testid="selected-loader" />
        <LoaderOverlay ref={captureOverlay} data-testid="loader-overlay">
          Working
        </LoaderOverlay>
      </>
    ),
  );
  expect(screen.getByTestId('selected-loader')).toBe(selected);
  expect(screen.getByTestId('loader-overlay')).toBe(overlay);
  expect(overlay?.className).toContain('lui-loader-overlay');
}

it('forwards Loader and LoaderOverlay native refs', verifiesLoaderOverlay);
