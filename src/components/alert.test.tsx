import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Alert, AlertPropsProvider, type AlertRootBaseProps } from '../index';

/** Verify native Alert parts and a reactive provider status icon. */
function verifiesAlertComposition(): void {
  const [status, setStatus] = createSignal<'info' | 'success'>('info');
  /** Read the current status under the descendant's reactive owner. */
  function readDefaults(): AlertRootBaseProps {
    return { status: status() };
  }
  render(
    /** Keep provider state and its descendant inside the same reactive owner. */
    () => (
      <AlertPropsProvider value={readDefaults}>
        <Alert.Root data-testid="alert-root" role="status">
          <Alert.Indicator data-testid="alert-indicator" />
          <Alert.Content>
            <Alert.Title>Update</Alert.Title>
            <Alert.Description>Details</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </AlertPropsProvider>
    ),
  );

  const root = screen.getByTestId('alert-root');
  const indicator = screen.getByTestId('alert-indicator');
  expect(root.tagName).toBe('DIV');
  expect(root.getAttribute('role')).toBe('status');
  expect(root.textContent).toContain('Update');
  expect(indicator.tagName).toBe('SPAN');
  expect(indicator.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  const before = indicator.querySelector('path')?.getAttribute('d');
  setStatus('success');
  flush();
  expect(indicator.querySelector('path')?.getAttribute('d')).not.toBe(before);
  expect(root.hasAttribute('status')).toBe(false);
}

it(
  'renders Alert parts and updates the default icon with provider status',
  verifiesAlertComposition,
);

/** Keep the default glyph empty when status varies by viewport. */
function verifiesResponsiveStatusIcon(): void {
  render(
    /** Render the indicator inside a responsive Alert recipe. */
    () => (
      <Alert.Root status={{ base: 'info', md: 'success' }}>
        <Alert.Indicator data-testid="responsive-indicator" />
      </Alert.Root>
    ),
  );
  expect(screen.getByTestId('responsive-indicator').querySelector('svg')).toBeNull();
}

it('omits the default icon for responsive status values', verifiesResponsiveStatusIcon);

/** Preserve explicit empty children instead of substituting a default glyph. */
function verifiesIndicatorChildren(): void {
  render(
    /** Keep all indicator variants inside the same Alert context. */
    () => (
      <Alert.Root>
        <Alert.Indicator data-testid="null-indicator">{null}</Alert.Indicator>
        <Alert.Indicator data-testid="empty-indicator">{''}</Alert.Indicator>
        <Alert.Indicator data-testid="custom-indicator">Custom</Alert.Indicator>
      </Alert.Root>
    ),
  );
  expect(screen.getByTestId('null-indicator').querySelector('svg')).toBeNull();
  expect(screen.getByTestId('empty-indicator').querySelector('svg')).toBeNull();
  expect(screen.getByTestId('custom-indicator').textContent).toBe('Custom');
}

it('keeps null, empty, and custom indicator children', verifiesIndicatorChildren);
