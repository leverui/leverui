import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, Box, Button, Link, Stack, Text } from '../../src';

/** Keep a timestamp fixed while its surrounding style changes. */
function TimeStamp(): JSX.Element {
  const value = new Date().toISOString();
  return <Text data-testid="sandbox-timestamp">{value}</Text>;
}

/** Recolor direct and asChild boxes without remounting their content. */
export function SandboxReRenders(): JSX.Element {
  const [isRed, setIsRed] = createSignal(false);
  /** Switch the two box backgrounds on each button press. */
  function toggle(): void {
    setIsRed((value) => !value);
  }
  return (
    <Stack gap="5">
      <Box
        data-testid="sandbox-color-box"
        style={{
          background: isRed() ? 'var(--leverui-colors-red-200)' : 'var(--leverui-colors-blue-200)',
        }}
      >
        <TimeStamp />
      </Box>
      <Box
        as="mark"
        style={{
          color: 'var(--leverui-colors-red-500)',
          background: 'var(--leverui-colors-bg-error)',
          'padding-inline': 'var(--leverui-spacing-2)',
          'padding-block': 'var(--leverui-spacing-3)',
        }}
      >
        Welcome
      </Box>
      <Box
        style={{
          background: isRed() ? 'var(--leverui-colors-red-200)' : 'var(--leverui-colors-blue-200)',
        }}
        asChild={
          /** Keep the native button while forwarding the changing Box style. */
          (getProps) => (
            <button {...getProps()} type="button">
              <TimeStamp />
            </button>
          )
        }
      />
      <Box>
        <Button onClick={toggle}>Re-render</Button>
      </Box>
    </Stack>
  );
}

/** Show three nested semantic palettes and their inherited button colors. */
export function SandboxColorPalette(): JSX.Element {
  return (
    <Stack>
      <For each={['blue', 'green', 'red']}>
        {/** Scope each row's semantic color tokens to one palette. */}
        {(color) => (
          <Box data-leverui-color-palette={color}>
            <Box
              style={{
                background: 'var(--leverui-colors-color-palette-muted)',
                color: 'var(--leverui-colors-color-palette-fg)',
                padding: 'var(--leverui-spacing-4)',
              }}
            >
              Welcome to the{' '}
              <Link variant="underline" href="https://www.google.com">
                docs <Badge variant="solid"> New</Badge>
              </Link>
              <br />
              <Button>Click me</Button>
            </Box>
          </Box>
        )}
      </For>
    </Stack>
  );
}
