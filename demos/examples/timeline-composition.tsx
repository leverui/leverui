import { type JSX } from '@solidjs/web';
import { PenIcon, XIcon } from '@lucide/solid';
import { Avatar, Button, Card, Icon, Input, Span, Timeline } from '../../src';
import './timeline-composition.css';

/** Show avatar, text, card, and input content inside the activity track. */
export function TimelineComposition(): JSX.Element {
  return (
    <Timeline.Root size="lg" variant="subtle" class="timeline-composition-root">
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <Icon class="timeline-composition-small-icon">
              <PenIcon />
            </Icon>
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>
            <Avatar.Root size="2xs">
              <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
              <Avatar.Fallback />
            </Avatar.Root>
            Theo Park <Span class="timeline-composition-muted">changed</Span>{' '}
            <Span class="timeline-composition-emphasis">3 labels</Span> on{' '}
            <Span class="timeline-composition-muted">Jan 1, 2024</Span>
          </Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <Icon class="timeline-composition-small-icon">
              <XIcon />
            </Icon>
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>
            <Avatar.Root size="2xs">
              <Avatar.Image src="/demo-images/avatars/avatar-3.webp" />
              <Avatar.Fallback />
            </Avatar.Root>
            Mara Ellison <Span class="timeline-composition-muted">removed</Span>{' '}
            <Span class="timeline-composition-emphasis">Corin</Span>{' '}
            <Span class="timeline-composition-muted">on Jan 12, 2024</Span>
          </Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator class="timeline-composition-accent-indicator">
            <Icon class="timeline-composition-small-icon">
              <XIcon />
            </Icon>
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content class="timeline-composition-content">
          <Timeline.Title>
            <Avatar.Root size="2xs">
              <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
              <Avatar.Fallback />
            </Avatar.Root>
            Iris <Span class="timeline-composition-muted">commented</Span>{' '}
            <Span class="timeline-composition-muted">on Jan 12, 2024</Span>
          </Timeline.Title>
          <Card.Root size="sm">
            <Card.Body class="timeline-composition-card-body">
              The new labels look good to me. I moved two cards to the review column and will check
              the others tomorrow.
            </Card.Body>
            <Card.Footer>
              <Button size="xs" variant="surface" class="timeline-composition-reaction">
                👏 2
              </Button>
            </Card.Footer>
          </Card.Root>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <Avatar.Root size="full">
              <Avatar.Image src="/demo-images/avatars/avatar-4.webp" />
              <Avatar.Fallback />
            </Avatar.Root>
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content class="timeline-composition-input-content">
          <Input size="sm" placeholder="Add comment..." />
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  );
}
