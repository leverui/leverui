import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span } from '../../src';

export const colorPalettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
] as const;

export type ExamplePalette = (typeof colorPalettes)[number];

const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Display one component choice across the ten color palettes. */
export function PlaygroundMatrix<Value extends string>(props: {
  values: readonly Value[];
  renderCell: (value: Value, palette: ExamplePalette) => JSX.Element;
}): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={props.values}>
            {(value) => (
              <th scope="col" style={headingStyle}>
                {value}
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
              <For each={props.values}>
                {(value) => <td style={cellStyle}>{props.renderCell(value, palette)}</td>}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
