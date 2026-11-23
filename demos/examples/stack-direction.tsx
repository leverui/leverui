import { type JSX } from '@solidjs/web';
import { Box, HStack, Stack, VStack } from '../../src';
import './decorative-box.css';

/** Stack three patterned surfaces vertically. */
export function StackBasic(): JSX.Element {
  return (
    <Stack>
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

/** Stack three patterned surfaces in a horizontal row. */
export function StackHorizontal(): JSX.Element {
  return (
    <Stack direction="row" style={{ height: 'var(--lui-sizes-20)' }}>
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="100%"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="100%"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="100%"
      />
    </Stack>
  );
}

/** Align patterned surfaces of different heights in an HStack. */
export function StackWithHstack(): JSX.Element {
  return (
    <HStack>
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="10"
      />
      <Box class="example-decorative-box" data-decorative-width="100%" data-decorative-height="5" />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </HStack>
  );
}

/** Compare three widths in a centered VStack. */
export function StackWithVstack(): JSX.Element {
  return (
    <VStack>
      <Box class="example-decorative-box" data-decorative-width="50%" data-decorative-height="20" />
      <Box class="example-decorative-box" data-decorative-width="25%" data-decorative-height="20" />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </VStack>
  );
}

/** Switch Stack direction to a row at the medium breakpoint. */
export function StackWithResponsiveDirection(): JSX.Element {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} gap="10">
      <Box class="example-decorative-box" data-decorative-width="20" data-decorative-height="20" />
      <Box class="example-decorative-box" data-decorative-width="20" data-decorative-height="20" />
      <Box class="example-decorative-box" data-decorative-width="20" data-decorative-height="20" />
    </Stack>
  );
}
