import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Heading, Progress, Span, Square, Stack } from '../../src';
import { Folder, Lock, Pencil } from '@lucide/solid';

const features = [
  {
    max: 100,
    value: 65,
    label: 'Private users',
    icon: Lock,
  },
  {
    max: 100,
    value: 50,
    label: 'Editors',
    icon: Pencil,
  },
  {
    max: 5,
    value: 1,
    label: 'Projects',
    icon: Folder,
  },
] as const;

/** Render the three-feature usage summary. */
export function ProgressComposition(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'max-width': '300px' }}>
      <Heading size="sm">Plan usage</Heading>
      <For each={features}>
        {(data) => (
          <HStack gap="4">
            <Square
              size="10"
              style={{
                'border-radius': 'var(--lui-radii-sm)',
                background: 'var(--lui-colors-bg-muted)',
              }}
            >
              <data.icon />
            </Square>
            <Progress.Root size="sm" max={data.max} value={data.value} style={{ flex: '1' }}>
              <HStack justify="space-between">
                <Progress.Label>{data.label}</Progress.Label>
                <Progress.ValueText style={{ color: 'inherit' }}>
                  {data.value}{' '}
                  <Span style={{ color: 'var(--lui-colors-fg-muted)' }}>/ {data.max}</Span>
                </Progress.ValueText>
              </HStack>
              <Progress.Track style={{ 'margin-top': 'var(--lui-spacing-2)' }}>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </HStack>
        )}
      </For>
    </Stack>
  );
}
