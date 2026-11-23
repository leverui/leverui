import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span, Tag } from '../../src';
import { colorPalettes } from './playground-matrix';

const sizes = ['sm', 'md', 'lg', 'xl'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare all four tag sizes in all ten palettes. */
export function TagSizeTable(): JSX.Element {
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
                    <Tag.Root size={size} colorPalette={palette}>
                      <Tag.Label>Gray</Tag.Label>
                      <Tag.EndElement>
                        <Tag.CloseTrigger />
                      </Tag.EndElement>
                    </Tag.Root>
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
