import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Avatar, Button, Card, Image } from '../src';
import './card-guide.css';

const previewImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%236254c7'/%3E%3C/svg%3E";

/** Show guide compositions with an image, horizontal layout, and Avatar. */
function CardComposition(): JSX.Element {
  const [submitted, setSubmitted] = createSignal(false);

  /** Keep the native form on this story while confirming submission. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <div>
        <Card.Root class="card-story-horizontal" data-testid="card-horizontal">
          <Image
            src={previewImage}
            alt="Purple preview"
            style={{ width: '120px' }}
            fit="cover"
            data-testid="card-image"
          />
          <div>
            <Card.Body>
              <Card.Title>Image card</Card.Title>
              <Card.Description>Content beside an image.</Card.Description>
            </Card.Body>
            <Card.Footer>
              <Button>Open</Button>
            </Card.Footer>
          </div>
        </Card.Root>
        <Card.Root class="card-story-avatar" data-testid="card-avatar">
          <Card.Body>
            <Avatar.Root size="sm" data-testid="card-avatar-root">
              <Avatar.Fallback name="Ada Lovelace" />
            </Avatar.Root>
            <Card.Title>Team member</Card.Title>
            <Card.Description>Ada Lovelace requested access.</Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button variant="subtle">Approve</Button>
          </Card.Footer>
        </Card.Root>
        <form onSubmit={submitForm} data-testid="card-form">
          <Card.Root>
            <Card.Header>
              <Card.Title>Profile</Card.Title>
              <Card.Description>Update your display name.</Card.Description>
            </Card.Header>
            <Card.Body>
              <label for="card-display-name">Display name</label>
              <input id="card-display-name" name="displayName" required />
            </Card.Body>
            <Card.Footer>
              <Button type="submit">Save profile</Button>
            </Card.Footer>
          </Card.Root>
        </form>
        <output data-testid="card-form-result">{submitted() ? 'Saved' : 'Pending'}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Card Composition',
  component: CardComposition,
} satisfies Meta<typeof CardComposition>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
