import { type JSX } from '@solidjs/web';
import { Code, Stack, Text } from '../../src';

/** Show the plain text sample. */
export function TextBasic(): JSX.Element {
  return <Text>Sphinx of black quartz, judge my vow.</Text>;
}

/** Render the same text through four native elements. */
export function TextWithAsProp(): JSX.Element {
  return (
    <Stack>
      <Text as="p">
        Text rendered as <Code>p</Code> element.
      </Text>
      <Text as="label">
        Text rendered as <Code>label</Code> element.
      </Text>
      <Text as="div">
        Text rendered as <Code>div</Code> element.
      </Text>
      <Text as="span">
        Text rendered as <Code>span</Code> element.
      </Text>
    </Stack>
  );
}

/** Compare all eleven text styles in order. */
export function TextWithSizes(): JSX.Element {
  return (
    <Stack>
      <Text textStyle="xs">Lever UI</Text>
      <Text textStyle="sm">Lever UI</Text>
      <Text textStyle="md">Lever UI</Text>
      <Text textStyle="lg">Lever UI</Text>
      <Text textStyle="xl">Lever UI</Text>
      <Text textStyle="2xl">Lever UI</Text>
      <Text textStyle="3xl">Lever UI</Text>
      <Text textStyle="4xl">Lever UI</Text>
      <Text textStyle="5xl">Lever UI</Text>
      <Text textStyle="6xl">Lever UI</Text>
      <Text textStyle="7xl">Lever UI</Text>
    </Stack>
  );
}

/** Compare the five font weights. */
export function TextWithWeights(): JSX.Element {
  return (
    <Stack>
      <Text style={{ 'font-weight': 'var(--leverui-font-weights-light)' }}>
        Sphinx of black quartz, judge my vow.
      </Text>
      <Text style={{ 'font-weight': 'var(--leverui-font-weights-normal)' }}>
        Sphinx of black quartz, judge my vow.
      </Text>
      <Text style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>
        Sphinx of black quartz, judge my vow.
      </Text>
      <Text style={{ 'font-weight': 'var(--leverui-font-weights-semibold)' }}>
        Sphinx of black quartz, judge my vow.
      </Text>
      <Text style={{ 'font-weight': 'var(--leverui-font-weights-bold)' }}>
        Sphinx of black quartz, judge my vow.
      </Text>
    </Stack>
  );
}
