import { type JSX } from '@solidjs/web';
import {
  Box,
  Button,
  createColorMode,
  createColorModeValue,
  DarkMode,
  HStack,
  LightMode,
  Stack,
} from '../../src';

/** Toggle the gallery's active light or dark theme. */
export function ColorModeBasic(): JSX.Element {
  const { toggleColorMode } = createColorMode();

  return (
    <Button variant="outline" onClick={toggleColorMode}>
      Toggle mode
    </Button>
  );
}

/** Keep two buttons in explicit nested modes while the root changes. */
export function ColorModeForced(): JSX.Element {
  const { toggleColorMode } = createColorMode();

  return (
    <HStack>
      <LightMode>
        <Button size="sm" variant="subtle">
          Always light mode
        </Button>
      </LightMode>
      <DarkMode>
        <Button size="sm" variant="subtle">
          Always dark mode
        </Button>
      </DarkMode>
      <Button size="sm" variant="subtle" onClick={toggleColorMode}>
        Toggle mode
      </Button>
    </HStack>
  );
}

/** Change explicit box colors according to the active gallery mode. */
export function ColorModeValue(): JSX.Element {
  const { toggleColorMode } = createColorMode();

  const bg = createColorModeValue('var(--leverui-colors-red-500)', 'var(--leverui-colors-red-200)');
  const color = createColorModeValue('white', 'var(--leverui-colors-gray-800)');

  return (
    <Stack align="flex-start" gap="4">
      <Box style={{ padding: 'var(--leverui-spacing-2)', background: bg(), color: color() }}>
        This box changes color when you switch the color mode.
      </Box>
      <Button variant="outline" size="sm" onClick={toggleColorMode}>
        Toggle mode
      </Button>
    </Stack>
  );
}
