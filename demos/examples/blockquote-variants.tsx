import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Blockquote, Span } from '../../src';
import { colorPalettes } from './playground-matrix';

const variants = ['subtle', 'solid', 'plain'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare every Blockquote variant across the ten palettes. */
export function BlockquoteVariantTable(): JSX.Element {
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
                    <Blockquote.Root variant={variant} colorPalette={palette}>
                      <Blockquote.Content>
                        A short quote that shows how this variant looks in each color palette.
                      </Blockquote.Content>
                    </Blockquote.Root>
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
