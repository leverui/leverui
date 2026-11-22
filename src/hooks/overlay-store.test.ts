import { flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { createOverlayStore } from './overlay-store';

interface DialogData {
  title: string;
  description?: string;
}

/** Verify a close result settles before the exit animation finishes. */
async function checksCloseResult(): Promise<void> {
  const overlay = createOverlayStore<DialogData, { message: string }>();
  const result = overlay.open('one', { title: 'First' });
  expect(overlay.get('one').open).toBe(true);
  const exit = overlay.close('one', { message: 'Welcome' });
  await expect(result).resolves.toEqual({ message: 'Welcome' });
  expect(overlay.get('one').open).toBe(false);
  overlay.get('one').onExitComplete?.();
  await expect(exit).resolves.toBeUndefined();
  expect(overlay.has('one')).toBe(false);
}

/** Verify updates retain lifecycle callbacks and change the visible snapshot. */
async function checksUpdate(): Promise<void> {
  const overlay = createOverlayStore<DialogData, void>({ title: 'Default' });
  const result = overlay.open('one', { title: 'Initial' });
  const closeFromDialog = overlay.get('one').onOpenChange;
  overlay.update('one', { title: 'Updated', description: 'Changed' });
  flush();
  expect(overlay.getSnapshot()[0]).toMatchObject({ title: 'Updated', description: 'Changed' });
  expect(overlay.get('one').onOpenChange).toBe(closeFromDialog);
  closeFromDialog?.({ open: false });
  await expect(result).resolves.toBeUndefined();
  overlay.get('one').onExitComplete?.();
  await expect(overlay.waitForExit('one')).resolves.toBeUndefined();
}

/** Verify removals cannot leave callers waiting on promises. */
async function checksRemoval(): Promise<void> {
  const overlay = createOverlayStore<DialogData, string>();
  const first = overlay.open('first', { title: 'First' });
  const second = overlay.open('second', { title: 'Second' });
  overlay.removeAll();
  await expect(first).resolves.toBeUndefined();
  await expect(second).resolves.toBeUndefined();
  expect(overlay.getSnapshot()).toEqual([]);
}

/** Verify renderer callbacks settle promises without affecting a replacement id. */
async function checksRendererCallbacks(): Promise<void> {
  const overlay = createOverlayStore<DialogData, string>();
  const first = overlay.open('one', { title: 'First' });
  const oldExit = overlay.get('one').onExitComplete;
  const oldChange = overlay.get('one').onOpenChange;
  overlay.get('one').setReturnValue?.('confirmed');
  await expect(first).resolves.toBe('confirmed');
  const second = overlay.open('one', { title: 'Second' });
  oldExit?.();
  oldChange?.({ open: false });
  expect(overlay.get('one').title).toBe('Second');
  expect(overlay.get('one').open).toBe(true);
  const exiting = overlay.close('one');
  overlay.get('one').setExitComplete?.();
  await expect(exiting).resolves.toBeUndefined();
  overlay.get('one').onExitComplete?.();
  await expect(second).resolves.toBeUndefined();
}

describe('createOverlayStore', () => {
  it('returns close values and waits for exit', checksCloseResult);
  it('updates mounted props without replacing lifecycle callbacks', checksUpdate);
  it('settles pending callers when entries are removed', checksRemoval);
  it('protects replacement entries and supports renderer callbacks', checksRendererCallbacks);
});
