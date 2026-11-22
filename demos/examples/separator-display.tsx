import { type JSX } from '@solidjs/web';
import { Box, HStack, Separator, Stack, Text } from '../../src';
import './decorative-box.css';

/** Separate three stacked text labels with horizontal rules. */
export function SeparatorBasic(): JSX.Element {
  return (
    <Stack>
      <Text>First</Text>
      <Separator />
      <Text>Second</Text>
      <Separator />
      <Text>Third</Text>
    </Stack>
  );
}

/** Put a short vertical rule between two labels. */
export function SeparatorVertical(): JSX.Element {
  return (
    <HStack gap="4">
      <Text>First</Text>
      <Separator orientation="vertical" style={{ height: 'var(--leverui-sizes-4)' }} />
      <Text>Second</Text>
    </HStack>
  );
}

/** Position labels before, after, and between horizontal rules. */
export function SeparatorWithLabel(): JSX.Element {
  return (
    <Stack>
      <HStack>
        <Text style={{ 'flex-shrink': '0' }}>Label (start)</Text>
        <Separator style={{ flex: '1' }} />
      </HStack>
      <HStack>
        <Separator style={{ flex: '1' }} />
        <Text style={{ 'flex-shrink': '0' }}>Label (end)</Text>
      </HStack>
      <HStack>
        <Separator style={{ flex: '1' }} />
        <Text style={{ 'flex-shrink': '0' }}>Label (center)</Text>
        <Separator style={{ flex: '1' }} />
      </HStack>
    </Stack>
  );
}

/** Switch orientation as the breakpoints change. */
export function SeparatorWithResponsiveOrientation(): JSX.Element {
  return (
    <Stack direction={{ base: 'row', md: 'column' }} align="stretch">
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="100%"
      >
        First
      </Box>
      <Separator orientation={{ base: 'vertical', sm: 'horizontal' }} />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="100%"
      >
        Second
      </Box>
    </Stack>
  );
}

/** Compare all four CSS thicknesses. */
export function SeparatorWithSizes(): JSX.Element {
  return (
    <Stack gap="4">
      <Separator size="xs" />
      <Separator size="sm" />
      <Separator size="md" />
      <Separator size="lg" />
    </Stack>
  );
}

/** Compare solid, dashed, and dotted lines. */
export function SeparatorWithVariants(): JSX.Element {
  return (
    <Stack>
      <Separator variant="solid" />
      <Separator variant="dashed" />
      <Separator variant="dotted" />
    </Stack>
  );
}
