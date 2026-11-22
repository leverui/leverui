import { Card, Timeline } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const events = [
  { title: 'Theo approved the invoice', time: 'Today, 11:34' },
  { title: 'Iris added 4 files', time: 'Today, 9:41' },
  { title: 'Jonah joined the team', time: 'Yesterday, 16:55' },
] as const;

/** The latest things that happened, newest first. */
export function ActivityCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Recent activity</Card.Title>
      </Card.Header>
      <Card.Body>
        <Timeline.Root size="sm">
          <For each={events}>
            {/** Show one event with its time. */}
            {(event) => (
              <Timeline.Item>
                <Timeline.Connector>
                  <Timeline.Separator />
                  <Timeline.Indicator />
                </Timeline.Connector>
                <Timeline.Content>
                  <Timeline.Title>{event.title}</Timeline.Title>
                  <Timeline.Description>{event.time}</Timeline.Description>
                </Timeline.Content>
              </Timeline.Item>
            )}
          </For>
        </Timeline.Root>
      </Card.Body>
    </Card.Root>
  );
}
