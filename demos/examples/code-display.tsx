import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Code, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

const codeVariants = ['solid', 'outline', 'subtle', 'surface'] as const;

/** Show the single inline code sample. */
export function CodeBasic(): JSX.Element {
  return <Code>{'console.log("Hello, world!")'}</Code>;
}

/** Compare the four Code sizes. */
export function CodeWithSizes(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Render one sample at each size. */
          (size) => <Code size={size}>console.log()</Code>
        }
      </For>
    </Stack>
  );
}

/** Compare the four Code variants. */
export function CodeWithVariants(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={codeVariants}>
        {
          /** Render one sample in each variant. */
          (variant) => <Code variant={variant}>console.log()</Code>
        }
      </For>
    </Stack>
  );
}

/** Compare the four code variants across the color palettes. */
export function CodeWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Render one labeled palette row. */
          (palette) => (
            <Stack
              align="center"
              direction="row"
              gap="10"
              style={{ 'padding-inline': 'var(--lui-spacing-4)', width: '100%' }}
            >
              <Text
                textStyle="sm"
                style={{
                  'min-width': '8ch',
                }}
              >
                {palette}
              </Text>
              <For each={codeVariants}>
                {
                  /** Show one color treatment in the current row. */
                  (variant) => (
                    <Code colorPalette={palette} variant={variant}>
                      console.log()
                    </Code>
                  )
                }
              </For>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}
