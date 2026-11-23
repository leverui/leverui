import { type JSX } from '@solidjs/web';
import { Heading, Stack } from '../../src';

/** Show the default heading and text. */
export function HeadingBasic(): JSX.Element {
  return <Heading>The quick brown fox jumps over the lazy dog</Heading>;
}

/** Compare all nine heading size variants in order. */
export function HeadingWithSizes(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <Heading size="sm">Heading (sm)</Heading>
      <Heading size="md">Heading (md)</Heading>
      <Heading size="lg">Heading (lg)</Heading>
      <Heading size="xl">Heading (xl)</Heading>
      <Heading size="2xl">Heading (2xl)</Heading>
      <Heading size="3xl">Heading (3xl)</Heading>
      <Heading size="4xl">Heading (4xl)</Heading>
      <Heading size="5xl">Heading (5xl)</Heading>
      <Heading size="6xl">Heading (6xl)</Heading>
    </Stack>
  );
}

/** Demonstrate native heading levels without changing their content. */
export function HeadingWithAsProp(): JSX.Element {
  return (
    <Stack>
      <Heading as="h1">Level 1</Heading>
      <Heading as="h2">Level 2</Heading>
      <Heading as="h3">Level 3</Heading>
    </Stack>
  );
}

/** Compare the four font weights. */
export function HeadingWithWeights(): JSX.Element {
  return (
    <Stack>
      <Heading style={{ 'font-weight': 'var(--lui-font-weights-normal)' }}>Normal</Heading>
      <Heading style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>Medium</Heading>
      <Heading style={{ 'font-weight': 'var(--lui-font-weights-semibold)' }}>Semibold</Heading>
      <Heading style={{ 'font-weight': 'var(--lui-font-weights-bold)' }}>Bold</Heading>
    </Stack>
  );
}
