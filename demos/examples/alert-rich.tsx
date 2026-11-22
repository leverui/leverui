import { type JSX } from '@solidjs/web';
import { AlarmClockPlusIcon, PercentIcon } from '@lucide/solid';
import { Alert, Link, Stack } from '../../src';
import './alert-customization.css';

/** Replace the warning indicator with the alarm icon. */
export function AlertWithCustomIcon(): JSX.Element {
  return (
    <Alert.Root status="warning">
      <Alert.Indicator>
        <AlarmClockPlusIcon />
      </Alert.Indicator>
      <Alert.Title>Your session ends in five minutes</Alert.Title>
    </Alert.Root>
  );
}

/** Show two customized success Alert layouts. */
export function AlertWithCustomization(): JSX.Element {
  return (
    <Stack gap="4">
      <Alert.Root title="Success" status="success">
        <Alert.Indicator>
          <PercentIcon />
        </Alert.Indicator>
        <Alert.Content class="alert-example-foreground">
          <Alert.Title>Spring sale: 20% off</Alert.Title>
          <Alert.Description>Upgrade your plan this week to get the discount.</Alert.Description>
        </Alert.Content>
        <Link style={{ 'align-self': 'center', 'font-weight': '500' }}>Upgrade</Link>
      </Alert.Root>
      <Alert.Root size="sm" class="alert-example-accent" title="Success" status="success">
        <PercentIcon />
        <Alert.Title class="alert-example-title-small">
          Heads up: the spring sale takes 20% off
        </Alert.Title>
      </Alert.Root>
    </Stack>
  );
}
