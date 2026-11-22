import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, test, vi } from 'vitest';
import { useDisclosure } from './use-disclosure';

afterEach(cleanup);

/** Verify local state, toggling, and callbacks including repeated actions. */
function verifiesUncontrolledDisclosure(): void {
  const onOpen = vi.fn();
  const onClose = vi.fn();
  let actions: ReturnType<typeof useDisclosure> | undefined;

  /** Expose the disclosure state while retaining its actions for assertions. */
  function Example() {
    actions = useDisclosure({ defaultOpen: true, onOpen, onClose });
    return <span>{actions.open() ? 'open' : 'closed'}</span>;
  }

  render(Example);
  expect(screen.getByText('open')).toBeTruthy();
  if (!actions) throw new Error('The disclosure did not mount.');
  actions.onClose();
  flush();
  expect(screen.getByText('closed')).toBeTruthy();
  actions.onClose();
  flush();
  expect(onClose).toHaveBeenCalledTimes(2);
  actions.onToggle();
  flush();
  expect(screen.getByText('open')).toBeTruthy();
  expect(onOpen).toHaveBeenCalledTimes(1);
  actions.setOpen(false);
  flush();
  expect(screen.getByText('closed')).toBeTruthy();
  expect(onClose).toHaveBeenCalledTimes(2);
}

test('useDisclosure coordinates local state and callbacks', verifiesUncontrolledDisclosure);

/** Verify controlled state and callbacks follow the latest reactive props. */
function verifiesControlledDisclosure(): void {
  const [externalOpen, setExternalOpen] = createSignal(false);
  const firstOpen = vi.fn();
  const nextOpen = vi.fn();
  const [openCallback, setOpenCallback] = createSignal<() => void>(firstOpen);
  const onClose = vi.fn();
  let actions: ReturnType<typeof useDisclosure> | undefined;

  /** Supply reactive controlled state and a replaceable callback. */
  function Example() {
    actions = useDisclosure({
      /** Read the latest external disclosure state. */
      get open() {
        return externalOpen();
      },
      /** Read the latest callback without rebuilding the disclosure. */
      get onOpen() {
        return openCallback();
      },
      onClose,
    });
    return <span>{actions.open() ? 'open' : 'closed'}</span>;
  }

  render(Example);
  if (!actions) throw new Error('The disclosure did not mount.');
  actions.onOpen();
  flush();
  expect(screen.getByText('closed')).toBeTruthy();
  expect(firstOpen).toHaveBeenCalledTimes(1);
  setOpenCallback(() => nextOpen);
  flush();
  actions.onToggle();
  flush();
  expect(nextOpen).toHaveBeenCalledTimes(1);
  setExternalOpen(true);
  flush();
  expect(screen.getByText('open')).toBeTruthy();
  actions.onToggle();
  flush();
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.getByText('open')).toBeTruthy();
}

test('useDisclosure follows controlled state and current callbacks', verifiesControlledDisclosure);
