import { Avatar, Badge, Button, Card, Input } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const members = [
  { name: 'Mara Ellison', email: 'mara@example.com', role: 'Owner', photo: 1 },
  { name: 'Theo Park', email: 'theo@example.com', role: 'Editor', photo: 2 },
  { name: 'Iris Calder', email: 'iris@example.com', role: 'Editor', photo: 3 },
  { name: 'Jonah Reyes', email: 'jonah@example.com', role: 'Viewer', photo: 4 },
] as const;

/** A team list with an invite field. */
export function TeamCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Members</Card.Title>
        <Card.Description>Invite people and set their roles.</Card.Description>
      </Card.Header>
      <Card.Body>
        <div class="home-example-row">
          <Input size="sm" type="email" placeholder="Email address" aria-label="Email address" />
          <Button size="sm" type="button">
            Invite
          </Button>
        </div>
        <ul class="home-example-list">
          <For each={members}>
            {/** Show one member with their portrait and role. */}
            {(member) => (
              <li class="home-example-row">
                <Avatar.Root size="sm">
                  <Avatar.Image src={`/demo-images/avatars/avatar-${member.photo}.webp`} />
                  <Avatar.Fallback name={member.name} />
                </Avatar.Root>
                <span class="home-example-person">
                  <strong>{member.name}</strong>
                  <span>{member.email}</span>
                </span>
                <Badge variant="outline">{member.role}</Badge>
              </li>
            )}
          </For>
        </ul>
      </Card.Body>
    </Card.Root>
  );
}
