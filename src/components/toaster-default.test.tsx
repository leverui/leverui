import { cleanup, render, screen } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { Toaster, toaster } from '../index';

afterEach(
  /** Remove notifications and regions between checks. */
  () => {
    toaster.dismiss();
    cleanup();
  },
);

/** Show a shared-store notification in the ready-made region and layout. */
async function verifiesDefaultToaster(): Promise<void> {
  render(
    /** Mount the region once, as an app root does. */
    () => <Toaster />,
  );
  toaster.create({ title: 'Saved', description: 'File saved successfully', type: 'info' });
  const description = await screen.findByText('File saved successfully');
  expect(screen.getByText('Saved')).toBeTruthy();
  expect(description.closest('.lui-toaster-default__toast')).not.toBeNull();
  expect(description.closest('.lui-toaster-default')).not.toBeNull();
}

/** Show a spinner for a loading notification. */
async function verifiesLoadingSpinner(): Promise<void> {
  render(
    /** Mount the region once. */
    () => <Toaster />,
  );
  toaster.create({ description: 'Uploading', type: 'loading' });
  const description = await screen.findByText('Uploading');
  const toast = description.closest('.lui-toaster-default__toast');
  expect(toast?.querySelector('.lui-toaster-default__spinner')).not.toBeNull();
}

it('renders shared toaster notifications with the default layout', verifiesDefaultToaster);
it('shows a spinner for loading notifications', verifiesLoadingSpinner);
