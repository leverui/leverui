import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { ActionBar } from '../index';

afterEach(cleanup);

/** Keep selection controls from submitting an ancestor form by default. */
function verifiesSelectionTriggerType(): void {
  render(
    /** Mount a visible Action Bar inside a native form. */
    () => (
      <>
        <form>
          <ActionBar.Root open>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <ActionBar.SelectionTrigger data-testid="selection-trigger">
                  Two selected
                </ActionBar.SelectionTrigger>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </ActionBar.Root>
        </form>
      </>
    ),
  );
  expect(screen.getByTestId('selection-trigger').getAttribute('type')).toBe('button');
}

it('defaults SelectionTrigger to type button', verifiesSelectionTriggerType);

/** Render a caller-owned machine with reactive inherited placement. */
function verifiesRootProvider(): void {
  /** Keep the Popover machine independent of Action Bar presentation. */
  function ProviderExample(): JSX.Element {
    const machine = ActionBar.useActionBar({ defaultOpen: true });
    const [placement, setPlacement] = createSignal<'bottom-start' | 'bottom-end'>('bottom-start');

    /** Switch the inherited placement without replacing the machine. */
    function moveEnd(): void {
      setPlacement('bottom-end');
      flush();
    }

    return (
      <>
        <button type="button" onClick={moveEnd}>
          Move end
        </button>
        <ActionBar.PropsProvider
          value={
            /** Read the nearest current placement default. */
            () => ({ placement: placement() })
          }
        >
          <ActionBar.RootProvider value={machine}>
            <ActionBar.Positioner data-testid="external-positioner">
              <ActionBar.Content>Caller-owned content</ActionBar.Content>
            </ActionBar.Positioner>
          </ActionBar.RootProvider>
        </ActionBar.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the independent Popover under the public Lever UI provider. */
    () => <ProviderExample />,
  );
  const positioner = screen.getByTestId('external-positioner');
  expect(positioner.className).toContain('action-bar__positioner');
  expect(screen.getByText('Caller-owned content')).toBeTruthy();
  expect(positioner.getAttribute('data-placement')).toBe('bottom-start');
  screen.getByRole('button', { name: 'Move end' }).click();
  expect(positioner.getAttribute('data-placement')).toBe('bottom-end');
  expect(screen.getByTestId('external-positioner')).toBe(positioner);
}

it('updates a caller-owned machine with reactive placement defaults', verifiesRootProvider);

/** Apply inherited presence defaults to a caller-owned closed Popover. */
function verifiesInheritedPresence(): void {
  /** Keep the machine closed while the provider controls content rendering. */
  function PresenceExample(): JSX.Element {
    const machine = ActionBar.useActionBar();
    return (
      <>
        <ActionBar.PropsProvider value={{ lazyMount: false }}>
          <ActionBar.RootProvider value={machine}>
            <ActionBar.Positioner>
              <ActionBar.Content data-testid="inherited-closed-content">
                Closed but mounted
              </ActionBar.Content>
            </ActionBar.Positioner>
          </ActionBar.RootProvider>
        </ActionBar.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the caller-owned machine under inherited presence settings. */
    () => <PresenceExample />,
  );
  expect(screen.getByTestId('inherited-closed-content')).toBeTruthy();
}

it('forwards inherited render settings to RootProvider', verifiesInheritedPresence);

/** Preserve a selected native positioner and its caller ref. */
function verifiesNativePositioner(): void {
  let selected: Element | undefined;

  /** Capture the native element rendered in place of the default div. */
  function captureSelected(element: Element): void {
    selected = element;
  }

  render(
    /** Render a visible bar through the polymorphic part contract. */
    () => (
      <>
        <ActionBar.Root open>
          <ActionBar.Positioner as="section" ref={captureSelected} data-testid="native-positioner">
            <ActionBar.Content>
              <ActionBar.SelectionTrigger type="submit">Selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
      </>
    ),
  );
  expect(selected?.tagName).toBe('SECTION');
  expect(screen.getByRole('button', { name: 'Selected' }).getAttribute('type')).toBe('submit');
}

it('preserves native positioner selection and explicit button type', verifiesNativePositioner);

/** Keep the primitive behavior and consumer hooks when root presentation is unstyled. */
function verifiesUnstyledActionBar(): void {
  render(
    /** Mount a visible Action Bar without the styling provider. */
    () => (
      <ActionBar.Root open unstyled placement="bottom-end">
        <ActionBar.Positioner class="consumer-positioner" data-testid="unstyled-positioner">
          <ActionBar.Content aria-label="Unstyled actions" data-testid="unstyled-content">
            <ActionBar.SelectionTrigger style={{ color: 'red' }}>
              Two selected
            </ActionBar.SelectionTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </ActionBar.Root>
    ),
  );
  const positioner = screen.getByTestId('unstyled-positioner');
  const content = screen.getByTestId('unstyled-content');
  const trigger = screen.getByRole('button', { name: 'Two selected' });
  expect(positioner.getAttribute('data-placement')).toBe('bottom-end');
  expect(positioner.getAttribute('data-unstyled')).toBe('');
  expect(positioner.classList.contains('consumer-positioner')).toBe(true);
  expect(content.getAttribute('data-unstyled')).toBe('');
  expect(content.getAttribute('role')).toBe('dialog');
  expect(trigger.getAttribute('type')).toBe('button');
  expect(trigger.style.color).toBe('red');
}

it('keeps native behavior and hooks without presentation', verifiesUnstyledActionBar);
