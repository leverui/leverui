import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon } from '@lucide/solid';
import { Avatar, Badge, Span, Stack, Timeline } from '../../src';

/** Compare the four sizes with the same activity content. */
export function TimelineWithSizes(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['sm', 'md', 'lg', 'xl'] as const}>
        {(size) => (
          <Timeline.Root size={size}>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <Avatar.Root size="full">
                    <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
                    <Avatar.Fallback name="Wren" />
                  </Avatar.Root>
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content style={{ 'font-size': 'var(--lui-font-sizes-xs)' }}>
                <Timeline.Title>
                  <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>wren</Span>{' '}
                  created a new project
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <CheckIcon />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content style={{ 'font-size': 'var(--lui-font-sizes-xs)' }}>
                <Timeline.Title style={size === 'sm' ? { 'margin-top': '-2px' } : undefined}>
                  <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>wren</Span>{' '}
                  changed status from <Badge size="sm">In progress</Badge> to{' '}
                  <Badge colorPalette="teal" size="sm">
                    Completed
                  </Badge>
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline.Root>
        )}
      </For>
    </Stack>
  );
}

/** Compare the four marker variants with the same activity content. */
export function TimelineWithVariants(): JSX.Element {
  return (
    <Stack gap="16">
      <For each={['subtle', 'solid', 'outline', 'plain'] as const}>
        {(variant) => (
          <Timeline.Root variant={variant}>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <Avatar.Root size="full">
                    <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
                    <Avatar.Fallback name="Wren" />
                  </Avatar.Root>
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>
                  <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>wren</Span>{' '}
                  created a new project
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <CheckIcon />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>
                  <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>wren</Span>{' '}
                  changed status from <Badge>In progress</Badge> to{' '}
                  <Badge colorPalette="teal">Completed</Badge>
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline.Root>
        )}
      </For>
    </Stack>
  );
}
