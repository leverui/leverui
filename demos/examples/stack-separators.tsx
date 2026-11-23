import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Separator, Stack, StackSeparator } from '../../src';
import './decorative-box.css';

/** Place default separators between stacked items. */
export function StackWithSeparator(): JSX.Element {
  return (
    <Stack
      separator={
        /** Give each gap its own default separator element. */
        (props) => <StackSeparator {...props} />
      }
    >
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </Stack>
  );
}

/** Color the separators red between surfaces. */
export function StackWithCustomSeparator(): JSX.Element {
  return (
    <Stack
      separator={
        /** Give each gap an individually styled red separator. */
        (props) => <Separator {...props} style={{ 'border-color': 'var(--lui-colors-red-500)' }} />
      }
    >
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </Stack>
  );
}

/** Change direction, width, and separator color across breakpoints. */
export function StackWithResponsiveSeparator(): JSX.Element {
  return (
    <>
      <style>{`.stack-gallery-responsive-separator { border-color: var(--lui-colors-green-500); }
        @media (min-width: 48rem) { .stack-gallery-responsive-separator { border-color: var(--lui-colors-red-200); } }`}</style>
      <Stack
        direction={['column', 'row']}
        separator={
          /** Keep breakpoint-specific separator colors across direction changes. */
          (props) => <StackSeparator {...props} class="stack-gallery-responsive-separator" />
        }
        gap={4}
        style={{ 'margin-top': 'var(--lui-spacing-10)' }}
      >
        <For each={['1', '2', '3'] as const}>
          {(label) => (
            <Box
              class="example-decorative-box"
              data-decorative-width="100%"
              data-decorative-width-md="40px"
              data-decorative-height="40px"
              data-decorative-flex="1"
            >
              {label}
            </Box>
          )}
        </For>
      </Stack>
    </>
  );
}
