import { type JSX } from '@solidjs/web';
import * as Avatar from '../src/components/avatar';
import { Timeline } from '../src/components/timeline-exports';

/** Show content before the connector, alternating sides, and an Avatar marker. */
export function TimelineCompositionExample(): JSX.Element {
  return (
    <>
      <Timeline.Root data-testid="timeline-content-before">
        <Timeline.Item>
          <Timeline.Content style={{ width: 'auto' }} data-testid="timeline-before-content">
            <Timeline.Title style={{ 'white-space': 'nowrap' }}>2026</Timeline.Title>
          </Timeline.Content>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator>1</Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>First event</Timeline.Title>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>

      <Timeline.Root size="sm" variant="outline" data-testid="timeline-alternating">
        <Timeline.Item>
          <Timeline.Content style={{ flex: '1' }} />
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator />
          </Timeline.Connector>
          <Timeline.Content style={{ flex: '1' }}>
            <Timeline.Title>First event</Timeline.Title>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content style={{ flex: '1', 'align-items': 'flex-end' }}>
            <Timeline.Title>Second event</Timeline.Title>
          </Timeline.Content>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator />
          </Timeline.Connector>
          <Timeline.Content style={{ flex: '1' }} />
        </Timeline.Item>
      </Timeline.Root>

      <Timeline.Root size="lg" variant="subtle" data-testid="timeline-avatar-root">
        <Timeline.Item>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator data-testid="timeline-avatar-indicator">
              <Avatar.Root size="full">
                <Avatar.Fallback name="Ada Lovelace" />
              </Avatar.Root>
            </Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>Avatar milestone</Timeline.Title>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>
    </>
  );
}
