import { Card, Checkbox } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const tasks = [
  { label: 'Review the pull request', done: true },
  { label: 'Reply to Mara', done: true },
  { label: 'Update the changelog', done: false },
  { label: 'Book the team lunch', done: false },
] as const;

/** A short to-do list. */
export function TasksCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>To do</Card.Title>
      </Card.Header>
      <Card.Body>
        <div class="home-example-stack">
          <For each={tasks}>
            {/** Show one task with its checkbox. */}
            {(task) => (
              <Checkbox.Root size="sm" defaultChecked={task.done}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{task.label}</Checkbox.Label>
              </Checkbox.Root>
            )}
          </For>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
