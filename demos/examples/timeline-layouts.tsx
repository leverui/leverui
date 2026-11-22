import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Stack, Timeline } from '../../src';

/** Alternate event titles on either side of the indicator track. */
export function TimelineAlternating(): JSX.Element {
  return (
    <Timeline.Root size="sm" variant="outline">
      <Timeline.Item>
        <Timeline.Content style={{ flex: '1' }} />
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator />
        </Timeline.Connector>
        <Timeline.Content style={{ flex: '1' }}>
          <Timeline.Title>Order placed</Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Content style={{ flex: '1', 'align-items': 'flex-end' }}>
          <Timeline.Title>Order prepared</Timeline.Title>
        </Timeline.Content>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator />
        </Timeline.Connector>
        <Timeline.Content style={{ flex: '1' }} />
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Content style={{ flex: '1' }} />
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator />
        </Timeline.Connector>
        <Timeline.Content style={{ flex: '1' }}>
          <Timeline.Title>Order delivered</Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  );
}

const timelineSizes = ['sm', 'md', 'lg'] as const;

/** Compare dated content before the track at three sizes. */
export function TimelineWithContentBefore(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={timelineSizes}>
        {/** Render two matching date and title rows for one size. */}
        {(size) => (
          <Timeline.Root size={size}>
            <For each={['Nov 1994', 'Nov 2010']}>
              {/** Pair one date with its event title. */}
              {(date, index) => (
                <Timeline.Item>
                  <Timeline.Content style={{ width: 'auto' }}>
                    <Timeline.Title style={{ 'white-space': 'nowrap' }}>{date}</Timeline.Title>
                  </Timeline.Content>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>{index() + 1}</Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>
                      The company opened a new office in the city centre.
                    </Timeline.Title>
                  </Timeline.Content>
                </Timeline.Item>
              )}
            </For>
          </Timeline.Root>
        )}
      </For>
    </Stack>
  );
}
