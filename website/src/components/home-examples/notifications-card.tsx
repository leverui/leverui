import { Card, Switch } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const settings = [
  { label: 'Comments', detail: 'When someone replies to you.', on: true },
  { label: 'Mentions', detail: 'When someone names you.', on: true },
  { label: 'Weekly summary', detail: 'Every Monday morning.', on: false },
] as const;

/** Three email settings, each with a switch. */
export function NotificationsCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Notifications</Card.Title>
        <Card.Description>Choose which emails you receive.</Card.Description>
      </Card.Header>
      <Card.Body>
        <ul class="home-example-list">
          <For each={settings}>
            {/** Show one setting with its switch. */}
            {(setting) => (
              <li class="home-example-row">
                <span class="home-example-person">
                  <strong>{setting.label}</strong>
                  <span>{setting.detail}</span>
                </span>
                <Switch.Root size="sm" defaultChecked={setting.on} aria-label={setting.label}>
                  <Switch.HiddenInput />
                  <Switch.Control />
                </Switch.Root>
              </li>
            )}
          </For>
        </ul>
      </Card.Body>
    </Card.Root>
  );
}
