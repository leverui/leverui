import { type JSX } from '@solidjs/web';
import { Alert, Button, CloseButton, Spinner, Stack } from '../../src';
import './alert-close.css';
import './alert-loading.css';

/** Show the minimal informational Alert from the gallery. */
export function AlertBasic(): JSX.Element {
  return (
    <Alert.Root status="info" title="A new version is available">
      <Alert.Indicator />
      <Alert.Title>A new version is available</Alert.Title>
    </Alert.Root>
  );
}

/** Place a small action beside the Alert message. */
export function AlertWithButtons(): JSX.Element {
  return (
    <Alert.Root>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>A new version is available</Alert.Title>
        <Alert.Description>Update now to get the latest fixes.</Alert.Description>
      </Alert.Content>
      <Button size="sm" style={{ 'align-self': 'center' }}>
        Update
      </Button>
    </Alert.Root>
  );
}

/** Show the close affordance and long success message. */
export function AlertWithCloseButton(): JSX.Element {
  return (
    <Alert.Root>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Booking confirmed</Alert.Title>
        <Alert.Description>
          Your table for four is booked for Friday at 7 pm. We sent the details to your email
          address.
        </Alert.Description>
      </Alert.Content>
      <CloseButton class="example-alert-close" />
    </Alert.Root>
  );
}

/** Override the informational status's default blue palette. */
export function AlertWithColorPaletteOverride(): JSX.Element {
  return (
    <Alert.Root status="info" colorPalette="teal">
      <Alert.Indicator />
      <Alert.Title>This info alert uses the teal palette</Alert.Title>
    </Alert.Root>
  );
}

/** Explain a form error with a title and description. */
export function AlertWithDescription(): JSX.Element {
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Check the form</Alert.Title>
        <Alert.Description>Two fields are empty. Fill them in and try again.</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

/** Show progress using a spinner in the Alert indicator slot. */
export function AlertWithSpinner(): JSX.Element {
  return (
    <Alert.Root class="alert-example-loading" title="Loading your files">
      <Alert.Indicator>
        <Spinner size="sm" />
      </Alert.Indicator>
      <Alert.Title>Loading your files</Alert.Title>
    </Alert.Root>
  );
}

/** Compare the four Alert statuses in a vertical stack. */
export function AlertWithStatus(): JSX.Element {
  return (
    <Stack gap="4" style={{ width: '100%' }}>
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>We could not process your payment</Alert.Title>
      </Alert.Root>
      <Alert.Root status="info">
        <Alert.Indicator />
        <Alert.Title>Maintenance starts on Sunday at 2 am</Alert.Title>
      </Alert.Root>
      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Title>Your trial ends in three days. Upgrade to keep your projects.</Alert.Title>
      </Alert.Root>
      <Alert.Root status="success">
        <Alert.Indicator />
        <Alert.Title>Your files were uploaded</Alert.Title>
      </Alert.Root>
    </Stack>
  );
}

/** Compare the four variants with the same success message. */
export function AlertWithVariants(): JSX.Element {
  return (
    <Stack gap="4" style={{ width: '100%' }}>
      <Alert.Root status="success" variant="subtle">
        <Alert.Indicator />
        <Alert.Title>Your files were uploaded</Alert.Title>
      </Alert.Root>
      <Alert.Root status="success" variant="solid">
        <Alert.Indicator />
        <Alert.Title>Your files were uploaded</Alert.Title>
      </Alert.Root>
      <Alert.Root status="success" variant="outline">
        <Alert.Indicator />
        <Alert.Title>Your files were uploaded</Alert.Title>
      </Alert.Root>
      <Alert.Root status="success" variant="surface">
        <Alert.Indicator />
        <Alert.Title>Your files were uploaded</Alert.Title>
      </Alert.Root>
    </Stack>
  );
}

/** Supply the Alert anatomy preview to Storybook and the website. */
export function AlertExplorerDemo(): JSX.Element {
  return (
    <Alert.Root status="info" variant="subtle">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Update available</Alert.Title>
        <Alert.Description>Restart the app to install the new version.</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
