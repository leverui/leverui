import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Checkbox, Span, Stack } from '../../src';
import { colorPalettes } from './playground-matrix';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['solid', 'outline', 'subtle'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Show the Checkbox size matrix. */
export function CheckboxSizeTable(): JSX.Element {
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
                    'font-size': 'var(--leverui-font-sizes-sm)',
                    color: 'var(--leverui-colors-fg-muted)',
                    'min-width': '8ch',
                  }}
                >
                  {palette}
                </Span>
              </th>
              <For each={sizes}>
                {(size) => (
                  <td style={cellStyle}>
                    <Stack>
                      <Checkbox.Root colorPalette={palette} size={size}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root colorPalette={palette} size={size} defaultChecked>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
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

/** Show the Checkbox variant matrix. */
export function CheckboxVariantTable(): JSX.Element {
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
                    'font-size': 'var(--leverui-font-sizes-sm)',
                    color: 'var(--leverui-colors-fg-muted)',
                    'min-width': '8ch',
                  }}
                >
                  {palette}
                </Span>
              </th>
              <For each={variants}>
                {(variant) => (
                  <td style={cellStyle}>
                    <Stack>
                      <Checkbox.Root colorPalette={palette} variant={variant}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root colorPalette={palette} variant={variant} defaultChecked>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        colorPalette={palette}
                        variant={variant}
                        defaultChecked
                        disabled
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
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
