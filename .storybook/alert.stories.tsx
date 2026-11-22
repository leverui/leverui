import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Alert, AlertPropsProvider, Theme } from '../src';

/** Exercise Alert status, size, palette, native semantics, and custom content. */
function AlertContractExample(): JSX.Element {
  const [success, setSuccess] = createSignal(false);

  /** Change inherited status without replacing the Alert root. */
  function toggleStatus(): void {
    setSuccess(!success());
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '12px', width: '480px' }}>
        <Alert.Root data-testid="alert-default" role="status">
          <Alert.Indicator data-testid="alert-default-indicator" />
          <Alert.Content data-testid="alert-default-content">
            <Alert.Title data-testid="alert-default-title">Information</Alert.Title>
            <Alert.Description data-testid="alert-default-description">
              Details are available.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
        <Alert.Root status="error" variant="solid" size="sm" inline data-testid="alert-error">
          <Alert.Indicator data-testid="alert-error-indicator" />
          <Alert.Content data-testid="alert-error-content">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>Try again.</Alert.Description>
          </Alert.Content>
        </Alert.Root>
        <Alert.Root status="warning" variant="outline" size="lg" data-testid="alert-outline">
          <Alert.Indicator>!</Alert.Indicator>
          <Alert.Content>Custom indicator</Alert.Content>
        </Alert.Root>
        <Alert.Root status="success" variant="surface" data-testid="alert-surface">
          <Alert.Indicator />
          <Alert.Content>Complete</Alert.Content>
        </Alert.Root>
        <Alert.Root status="success" data-testid="alert-success">
          <Alert.Indicator data-testid="alert-success-indicator" />
          <Alert.Content>Success palette</Alert.Content>
        </Alert.Root>
        <Alert.Root status="info" colorPalette="teal" data-testid="alert-custom-palette">
          <Alert.Indicator />
          <Alert.Content>Teal information</Alert.Content>
        </Alert.Root>
        <Alert.Root
          size={{ base: 'sm', md: 'lg' }}
          variant={{ base: 'surface', md: 'solid' }}
          inline={{ base: false, md: true }}
          data-testid="alert-responsive"
        >
          <Alert.Indicator />
          <Alert.Content data-testid="alert-responsive-content">Responsive choices</Alert.Content>
        </Alert.Root>
        <Alert.Root status={{ base: 'info', md: 'success' }} data-testid="alert-responsive-status">
          <Alert.Content>Responsive status</Alert.Content>
        </Alert.Root>
        <Theme appearance="dark" hasBackground={false}>
          <Alert.Root status="neutral" data-testid="alert-dark">
            <Alert.Indicator />
            <Alert.Content>Dark scope</Alert.Content>
          </Alert.Root>
          <Alert.Root status="info" data-testid="alert-scope-dark">
            <Alert.Indicator />
            <Alert.Content>Dark blue</Alert.Content>
          </Alert.Root>
          <Theme appearance="light" hasBackground={false}>
            <Alert.Root status="info" data-testid="alert-scope-light">
              <Alert.Indicator />
              <Alert.Content>Nested light blue</Alert.Content>
            </Alert.Root>
          </Theme>
        </Theme>
        <AlertPropsProvider value={() => ({ status: success() ? 'success' : 'info' })}>
          <Alert.Root data-testid="alert-reactive">
            <Alert.Indicator data-testid="alert-reactive-indicator" />
            <Alert.Content>Reactive</Alert.Content>
          </Alert.Root>
          <Alert.Root status="warning" data-testid="alert-fixed-status">
            <Alert.Indicator data-testid="alert-fixed-indicator" />
            <Alert.Content>Explicit status</Alert.Content>
          </Alert.Root>
        </AlertPropsProvider>
        <button type="button" onClick={toggleStatus} data-testid="alert-toggle">
          Change status
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Feedback/Alert',
  component: AlertContractExample,
} satisfies Meta<typeof AlertContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
