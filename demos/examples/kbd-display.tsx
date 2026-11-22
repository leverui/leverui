import { type JSX } from '@solidjs/web';
import { HStack, Kbd, KbdPropsProvider, Stack, Text } from '../../src';

/** Show the default keyboard label. */
export function KbdBasic(): JSX.Element {
  return <Kbd>Shift + Tab</Kbd>;
}

/** Display the four modifier-key glyphs in order. */
export function KbdFunctionKeys(): JSX.Element {
  return (
    <HStack>
      <Kbd>⌘</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌃</Kbd>
    </HStack>
  );
}

/** Show separate labels for one keyboard shortcut. */
export function KbdWithCombinations(): JSX.Element {
  return (
    <HStack gap="1">
      <Kbd>ctrl</Kbd>+<Kbd>shift</Kbd>+<Kbd>del</Kbd>
    </HStack>
  );
}

/** Group shortcut keys and share one size and variant across them. */
export function KbdWithGroup(): JSX.Element {
  return (
    <Stack gap="4" align="flex-start">
      <HStack as="kbd" gap="1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </HStack>
      <KbdPropsProvider value={{ size: 'sm', variant: 'subtle' }}>
        <HStack as="kbd" gap="1">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>Shift</Kbd>
          <span>+</span>
          <Kbd>P</Kbd>
        </HStack>
      </KbdPropsProvider>
    </Stack>
  );
}

/** Compare the four Kbd treatments. */
export function KbdWithVariants(): JSX.Element {
  return (
    <HStack gap="4">
      <Kbd variant="raised">Shift + Tab</Kbd>
      <Kbd variant="outline">Shift + Tab</Kbd>
      <Kbd variant="subtle">Shift + Tab</Kbd>
      <Kbd variant="plain">Shift + Tab</Kbd>
    </HStack>
  );
}

/** Compare the three Kbd sizes. */
export function KbdWithSizes(): JSX.Element {
  return (
    <HStack gap="4">
      <Kbd size="sm">Shift + Tab</Kbd>
      <Kbd size="md">Shift + Tab</Kbd>
      <Kbd size="lg">Shift + Tab</Kbd>
    </HStack>
  );
}

/** Highlight a key inside running text. */
export function KbdWithinText(): JSX.Element {
  return (
    <Text>
      Press <Kbd>F12</Kbd> to open DevTools
    </Text>
  );
}
