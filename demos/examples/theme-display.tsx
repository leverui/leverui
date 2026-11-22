import { type JSX } from '@solidjs/web';
import { Box, Button, Stack, Theme } from '../../src';
import './theme-display.css';

/** Show automatic, dark, and light button styling in separate scopes. */
export function ThemeBasic(): JSX.Element {
  return (
    <Stack align="flex-start">
      <Button variant="surface" colorPalette="teal">
        Auto button
      </Button>
      <Theme class="theme-example-panel" appearance="dark" colorPalette="teal">
        <Button variant="surface">Dark button</Button>
      </Theme>
      <Theme class="theme-example-panel" appearance="light" colorPalette="teal">
        <Button variant="surface">Light button</Button>
      </Theme>
    </Stack>
  );
}

/** Nest dark and light scopes around the bordered boxes. */
export function ThemeNested(): JSX.Element {
  return (
    <Box>
      <Box class="theme-example-nested-box">
        Default theme <Button>Click me</Button>
        <Theme appearance="dark" colorPalette="red">
          <Box class="theme-example-nested-box">
            Dark theme <Button>Click me</Button>
            <Theme appearance="light" colorPalette="pink">
              <Box class="theme-example-nested-box">
                Light theme <Button>Click me</Button>
              </Box>
            </Theme>
          </Box>
        </Theme>
      </Box>
    </Box>
  );
}
