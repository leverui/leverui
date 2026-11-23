import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Progress, Span, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const variants = ['outline', 'subtle'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare every size against all ten palettes. */
export function ProgressSizeTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={sizes}>
            {(size) => (
              <th scope="col" style={headingStyle}>
                {size}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={colorPalettes}>
          {(palette) => (
            <tr>
              <th scope="row" style={headingStyle}>
                <Span
                  style={{
                    'font-size': 'var(--lui-font-sizes-sm)',
                    color: 'var(--lui-colors-fg-muted)',
                    'min-width': '8ch',
                  }}
                >
                  {palette}
                </Span>
              </th>
              <For each={sizes}>
                {(size) => (
                  <td style={cellStyle}>
                    <Progress.Root
                      style={{ 'min-width': '200px' }}
                      colorPalette={palette}
                      size={size}
                      value={65}
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

/** Compare both visual variants with the three stripe states. */
export function ProgressVariantTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={variants}>
            {(variant) => (
              <th scope="col" style={headingStyle}>
                {variant}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={colorPalettes}>
          {(palette) => (
            <tr>
              <th scope="row" style={headingStyle}>
                <Span
                  style={{
                    'font-size': 'var(--lui-font-sizes-sm)',
                    color: 'var(--lui-colors-fg-muted)',
                    'min-width': '8ch',
                  }}
                >
                  {palette}
                </Span>
              </th>
              <For each={variants}>
                {(variant) => (
                  <td style={cellStyle}>
                    <Stack style={{ 'min-width': '200px' }}>
                      <Progress.Root colorPalette={palette} variant={variant} value={65}>
                        <Progress.Track>
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                      <Progress.Root colorPalette={palette} variant={variant} striped value={65}>
                        <Progress.Track>
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                      <Progress.Root
                        colorPalette={palette}
                        variant={variant}
                        striped
                        animated
                        value={65}
                      >
                        <Progress.Track>
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                    </Stack>
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

/** Compare outline and subtle bars in all ten palettes. */
export function ProgressWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {(colorPalette) => (
          <Stack
            align="center"
            direction="row"
            gap="10"
            style={{ 'padding-inline': 'var(--lui-spacing-4)' }}
          >
            <Text style={{ 'min-width': '8ch' }}>{colorPalette}</Text>
            <Progress.Root
              style={{ width: '120px' }}
              defaultValue={40}
              colorPalette={colorPalette}
              variant="outline"
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Progress.Root
              style={{ width: '120px' }}
              defaultValue={40}
              colorPalette={colorPalette}
              variant="subtle"
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Stack>
        )}
      </For>
    </Stack>
  );
}
