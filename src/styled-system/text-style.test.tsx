import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Box, Center, Circle, Flex, HStack, Span, Square, Stack, Text, VStack } from '../index';
import { textStyleAttributes, textStyles } from './text-style';

/** Expose each preset through one data attribute on every layout and text primitive. */
function verifiesPrimitiveAttributes(): void {
  render(
    /** Mount one element per primitive with a distinct preset. */
    () => (
      <>
        <Text textStyle="sm">text</Text>
        <Span textStyle="xs">span</Span>
        <Box textStyle="lg">box</Box>
        <Center textStyle="2xl">center</Center>
        <Stack textStyle="md">stack</Stack>
        <HStack textStyle="xl">hstack</HStack>
        <VStack textStyle="3xl">vstack</VStack>
        <Flex textStyle="label">flex</Flex>
        <Square textStyle="4xl">square</Square>
        <Circle textStyle="7xl">circle</Circle>
      </>
    ),
  );
  const expected: Record<string, string> = {
    text: 'sm',
    span: 'xs',
    box: 'lg',
    center: '2xl',
    stack: 'md',
    hstack: 'xl',
    vstack: '3xl',
    flex: 'label',
    square: '4xl',
    circle: '7xl',
  };
  for (const [label, style] of Object.entries(expected)) {
    expect(screen.getByText(label).getAttribute('data-text-style')).toBe(style);
  }
}

/** Update the attribute in place when the selected preset changes. */
function verifiesReactivePreset(): void {
  const [style, setStyle] = createSignal<'sm' | 'lg' | undefined>('sm');
  render(
    /** Mount Text with a changing preset. */
    () => <Text textStyle={style()}>changing</Text>,
  );
  const element = screen.getByText('changing');
  setStyle('lg');
  flush();
  expect(element.getAttribute('data-text-style')).toBe('lg');
  setStyle(undefined);
  flush();
  expect(element.hasAttribute('data-text-style')).toBe(false);
  expect(screen.getByText('changing')).toBe(element);
}

/** Reject names outside the documented preset list. */
function verifiesUnsupportedNames(): void {
  expect(textStyleAttributes(undefined)).toEqual({});
  for (const name of textStyles) {
    expect(textStyleAttributes(name)).toEqual({ 'data-text-style': name });
  }
  expect(() => textStyleAttributes('body-sm')).toThrow('Text style is unsupported: body-sm.');
}

it('applies text style presets to text and layout primitives', verifiesPrimitiveAttributes);
it('updates the text style preset reactively', verifiesReactivePreset);
it('rejects unsupported text style names', verifiesUnsupportedNames);
