import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Stack, Status } from '../../src';
import './status-examples.css';

const states = [
  { palette: 'red', label: 'Error' },
  { palette: 'blue', label: 'Info' },
  { palette: 'orange', label: 'Warning' },
  { palette: 'green', label: 'Success' },
] as const;

/** Display the four indicator colors without labels. */
export function StatusBasic(): JSX.Element {
  return (
    <HStack gap="6">
      <For each={states}>
        {(state) => (
          <Status.Root colorPalette={state.palette}>
            <Status.Indicator />
          </Status.Root>
        )}
      </For>
    </HStack>
  );
}

/** Pair the same four status colors with their labels. */
export function StatusWithLabel(): JSX.Element {
  return (
    <HStack gap="6">
      <For each={states}>
        {(state) => (
          <Status.Root colorPalette={state.palette}>
            <Status.Indicator />
            {state.label}
          </Status.Root>
        )}
      </For>
    </HStack>
  );
}

const sizeRows = ['sm', 'md', 'lg'] as const;
const sizeStates = [
  { palette: 'orange', label: 'In review' },
  { palette: 'red', label: 'Error' },
  { palette: 'green', label: 'Approved' },
] as const;

/** Show the three status sizes with fixed-width labels. */
export function StatusWithSizes(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={sizeRows}>
        {(size) => (
          <HStack gap="10" class="example-status-row">
            <For each={sizeStates}>
              {(state) => (
                <Status.Root size={size} class="example-status-item" colorPalette={state.palette}>
                  <Status.Indicator />
                  {state.label}
                </Status.Root>
              )}
            </For>
          </HStack>
        )}
      </For>
    </Stack>
  );
}
