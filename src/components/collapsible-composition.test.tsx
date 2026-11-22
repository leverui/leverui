import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Collapsible } from './collapsible-exports';

afterEach(cleanup);

/** Preserve native disclosure attributes while toggling the primitive machine. */
async function verifiesDisclosure(): Promise<void> {
  render(
    /** Mount all public Collapsible parts without a styling provider. */
    () => (
      <Collapsible.Root>
        <Collapsible.Trigger data-testid="trigger">
          Toggle <Collapsible.Indicator data-testid="indicator">›</Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Details</Collapsible.Content>
      </Collapsible.Root>
    ),
  );
  const trigger = screen.getByTestId('trigger');
  const content = screen.getByTestId('content');
  expect(trigger.getAttribute('type')).toBe('button');
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(content.hasAttribute('hidden')).toBe(true);
  expect(trigger.getAttribute('aria-controls')).toBe(content.id);
  fireEvent.click(trigger);
  await waitFor(
    /** Wait for Zag's asynchronous state transition to reach the primitive props. */
    () => expect(trigger.getAttribute('aria-expanded')).toBe('true'),
  );
  expect(content.hasAttribute('hidden')).toBe(false);
  expect(screen.getByTestId('indicator').getAttribute('data-state')).toBe('open');
}

it(
  'preserves the primitive disclosure state and native accessibility attributes',
  verifiesDisclosure,
);

/** Keep a caller-owned machine independent from inherited machine defaults. */
function verifiesRootProvider(): void {
  /** Render the external machine under a reactive consumer class. */
  function ProviderExample(): JSX.Element {
    const machine = Collapsible.useCollapsible({ defaultOpen: false });
    const [largePadding, setLargePadding] = createSignal(false);

    /** Change only the inherited presentation class. */
    function increasePadding(): void {
      setLargePadding(true);
      flush();
    }

    return (
      <>
        <button type="button" onClick={increasePadding}>
          Increase padding
        </button>
        <Collapsible.PropsProvider
          value={
            /** Track the current padding without replacing the external machine. */
            () => ({
              defaultOpen: true,
              id: 'inherited-collapsible-root',
              class: largePadding() ? 'collapsible-pad-large' : 'collapsible-pad-small',
            })
          }
        >
          <Collapsible.RootProvider value={machine} data-testid="external-root">
            <Collapsible.Trigger>External toggle</Collapsible.Trigger>
            <Collapsible.Content>External content</Collapsible.Content>
          </Collapsible.RootProvider>
        </Collapsible.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the external machine in one Solid owner. */
    () => <ProviderExample />,
  );
  const root = screen.getByTestId('external-root');
  expect(root.getAttribute('data-state')).toBe('closed');
  expect(root.id).toBe('inherited-collapsible-root');
  const beforeClass = root.className;
  expect(beforeClass).toContain('collapsible-pad-small');
  fireEvent.click(screen.getByRole('button', { name: 'Increase padding' }));
  expect(root.className).not.toBe(beforeClass);
  expect(root.className).toContain('collapsible-pad-large');
  expect(root.id).toBe('inherited-collapsible-root');
  expect(screen.getByTestId('external-root')).toBe(root);
}

it('keeps RootProvider state caller-owned while provider styles react', verifiesRootProvider);

/** Preserve selected native root and trigger elements with their refs. */
function verifiesNativeSelection(): void {
  let selectedRoot: Element | undefined;
  let selectedTrigger: Element | undefined;

  /** Capture the selected root element. */
  function captureRoot(element: Element): void {
    selectedRoot = element;
  }

  /** Capture the selected trigger element. */
  function captureTrigger(element: Element): void {
    selectedTrigger = element;
  }

  render(
    /** Replace both defaults with valid native disclosure elements. */
    () => (
      <>
        <Collapsible.Root as="section" ref={captureRoot}>
          <Collapsible.Trigger as="button" ref={captureTrigger}>
            Toggle native
          </Collapsible.Trigger>
          <Collapsible.Content>Native content</Collapsible.Content>
        </Collapsible.Root>
      </>
    ),
  );
  expect(selectedRoot?.tagName).toBe('SECTION');
  expect(selectedTrigger?.tagName).toBe('BUTTON');
}

it('supports native root and trigger selection with caller refs', verifiesNativeSelection);
