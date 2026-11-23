import { Show, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, Box, Button, Field, HStack, Input, Loader, LoaderOverlay, Stack } from '../../src';
import './loader-standard.css';

/** Show a loading indicator and text in the inline layout. */
export function LoaderBasic(): JSX.Element {
  return (
    <HStack
      textStyle="sm"
      style={{
        'font-weight': 'var(--lui-font-weights-medium)',
      }}
    >
      <Loader text="Loading...">View report</Loader>
    </HStack>
  );
}

/** Show the same inline Loader inside a Badge. */
export function LoaderWithBadge(): JSX.Element {
  return (
    <Badge>
      <Loader text="Loading...">View report</Loader>
    </Badge>
  );
}

/** Show a form that can be covered by a loading overlay. */
export function LoaderWithOverlay(): JSX.Element {
  const [loading, setLoading] = createSignal(false);

  /** Toggle the form overlay from the external button. */
  function toggleLoading(): void {
    setLoading(!loading());
  }

  return (
    <Stack gap="4" style={{ 'max-width': 'var(--lui-sizes-xl)' }}>
      <Box
        style={{
          position: 'relative',
          padding: 'var(--lui-spacing-6)',
          background: 'var(--lui-colors-bg-panel)',
          'box-shadow': 'var(--lui-shadows-sm)',
          'border-radius': 'var(--lui-radii-l3)',
        }}
      >
        <Stack gap="4">
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <Input />
          </Field.Root>
          <Field.Root>
            <Field.Label>Last name</Field.Label>
            <Input />
          </Field.Root>
          <Button>Save</Button>
        </Stack>
        <Show when={loading()}>
          <LoaderOverlay class="loader-example-overlay">
            <Loader class="loader-example-text" text="Loading..." />
          </LoaderOverlay>
        </Show>
      </Box>
      <Button style={{ 'align-self': 'flex-start' }} variant="outline" onClick={toggleLoading}>
        Toggle loading
      </Button>
    </Stack>
  );
}
