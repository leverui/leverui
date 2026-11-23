import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Code, Span } from '../../src';
import { colorPalettes } from './playground-matrix';

const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;
const paletteLabelStyle = {
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'min-width': '8ch',
} as const;

/** Compare every Code size across the color palettes. */
export function CodeSizeTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={['xs', 'sm', 'md', 'lg'] as const}>
            {
              /** Label one size column. */
              (size) => (
                <th scope="col" style={headingStyle}>
                  {size}
                </th>
              )
            }
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={colorPalettes}>
          {
            /** Render one palette across every size. */
            (palette) => (
              <tr>
                <th scope="row" style={headingStyle}>
                  <Span style={paletteLabelStyle}>{palette}</Span>
                </th>
                <For each={['xs', 'sm', 'md', 'lg'] as const}>
                  {
                    /** Render one size and palette combination. */
                    (size) => (
                      <td style={cellStyle}>
                        <Code size={size} colorPalette={palette}>
                          console.log("Lever UI v3!")
                        </Code>
                      </td>
                    )
                  }
                </For>
              </tr>
            )
          }
        </For>
      </tbody>
    </table>
  );
}

/** Compare every Code variant across the color palettes. */
export function CodeVariantTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={['solid', 'subtle', 'outline', 'surface', 'plain'] as const}>
            {
              /** Label one variant column. */
              (variant) => (
                <th scope="col" style={headingStyle}>
                  {variant}
                </th>
              )
            }
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={colorPalettes}>
          {
            /** Render one palette across every variant. */
            (palette) => (
              <tr>
                <th scope="row" style={headingStyle}>
                  <Span style={paletteLabelStyle}>{palette}</Span>
                </th>
                <For each={['solid', 'subtle', 'outline', 'surface', 'plain'] as const}>
                  {
                    /** Render one variant and palette combination. */
                    (variant) => (
                      <td style={cellStyle}>
                        <Code
                          variant={variant}
                          colorPalette={palette}
                          style={{ 'min-width': '186px' }}
                        >
                          <span style={{ 'max-width': '19ch' }}>console.log("Lever UI v3!")</span>
                        </Code>
                      </td>
                    )
                  }
                </For>
              </tr>
            )
          }
        </For>
      </tbody>
    </table>
  );
}
