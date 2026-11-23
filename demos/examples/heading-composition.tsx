import { type JSX } from '@solidjs/web';
import { ArrowRightIcon } from '@lucide/solid';
import { Button, Heading, Highlight, Stack, Text } from '../../src';

/** Highlight the phrase inside a large heading. */
export function HeadingWithHighlight(): JSX.Element {
  return (
    <Stack>
      <Heading size="3xl" style={{ 'letter-spacing': 'var(--lui-letter-spacings-tight)' }}>
        <Highlight query="everyone can use" markStyle={{ color: 'var(--lui-colors-teal-600)' }}>
          Build Solid apps that everyone can use
        </Highlight>
      </Heading>
      <Text
        style={{
          'font-size': 'var(--lui-font-sizes-md)',
          color: 'var(--lui-colors-fg-muted)',
        }}
      >
        Lever UI gives you ready-made components that work with a keyboard, a mouse and a screen
        reader.
      </Text>
    </Stack>
  );
}

/** Pair the payment heading with its description and action. */
export function HeadingWithComposition(): JSX.Element {
  return (
    <Stack align="flex-start">
      <Heading size="2xl">Invoices for small shops</Heading>
      <Text
        style={{
          'margin-bottom': 'var(--lui-spacing-3)',
          'font-size': 'var(--lui-font-sizes-md)',
          color: 'var(--lui-colors-fg-muted)',
        }}
      >
        Send an invoice in a minute and see at a glance who has paid.
      </Text>
      <Button>
        Create account <ArrowRightIcon />
      </Button>
    </Stack>
  );
}

/** Fill the sentence with a red-to-blue text gradient. */
export function HeadingWithGradient(): JSX.Element {
  return (
    <Heading
      style={{
        background:
          'linear-gradient(to left, var(--lui-colors-red-500), var(--lui-colors-blue-500))',
        'background-clip': 'text',
        color: 'transparent',
      }}
    >
      The quick brown fox jumps over the lazy dog
    </Heading>
  );
}
