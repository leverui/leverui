import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, InfoTip, Progress, Stack } from '../../src';
import './progress-examples.css';

/** Show a Progress track at its default value and the width. */
export function ProgressBasic(): JSX.Element {
  return (
    <Progress.Root class="example-progress-sample">
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Compare the four sizes shown in the guide. */
export function ProgressWithSizes(): JSX.Element {
  return (
    <Stack gap="4" class="example-progress-sample">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Render one bar at the given size. */
          (size) => (
            <Progress.Root size={size}>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the subtle and outline visual styles. */
export function ProgressWithVariants(): JSX.Element {
  return (
    <Stack gap="4" class="example-progress-sample">
      <Progress.Root variant="subtle">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root variant="outline">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  );
}

/** Move the default stripes along the track. */
export function ProgressWithAnimatedStripes(): JSX.Element {
  return (
    <Progress.Root class="example-progress-sample" striped animated>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Add still stripes to the track. */
export function ProgressWithStripes(): JSX.Element {
  return (
    <Progress.Root class="example-progress-sample" striped>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Show an indeterminate bar with a null value. */
export function ProgressIndeterminate(): JSX.Element {
  return (
    <Progress.Root class="example-progress-sample" value={null}>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Place the usage label and value beside one 40-percent range. */
export function ProgressWithInlineLabel(): JSX.Element {
  return (
    <Progress.Root defaultValue={40} style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
      <HStack gap="5">
        <Progress.Label>Usage</Progress.Label>
        <Progress.Track style={{ flex: '1' }}>
          <Progress.Range />
        </Progress.Track>
        <Progress.ValueText>40%</Progress.ValueText>
      </HStack>
    </Progress.Root>
  );
}

/** Put a value label above one 40-percent track. */
export function ProgressWithLabel(): JSX.Element {
  return (
    <Progress.Root defaultValue={40} class="example-progress-sample">
      <HStack justify="space-between" class="example-progress-label-row">
        <Progress.Label>Token usage</Progress.Label>
        <Progress.ValueText />
      </HStack>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Explain the upload status through a small popover. */
export function ProgressWithLabelInfo(): JSX.Element {
  return (
    <Progress.Root class="example-progress-sample">
      <Progress.Label class="example-progress-label">
        Uploading
        <InfoTip contentProps={{ 'aria-label': 'Upload information' }}>
          Your document is uploading to the server.
        </InfoTip>
      </Progress.Label>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Render the labelled bar used by the part explorer. */
export function ProgressExplorerDemo(): JSX.Element {
  return (
    <Stack gap="8" align="start">
      <Progress.Root value={60} max={100} style={{ width: '240px' }}>
        <Progress.Label>Loading…</Progress.Label>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
        <Progress.ValueText />
      </Progress.Root>
    </Stack>
  );
}
