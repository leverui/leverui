import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Slider, Span } from '../../src';
import { colorPalettes } from './playground-matrix';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['outline', 'solid'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare every slider CSS size across ten palettes. */
export function SliderSizes(): JSX.Element {
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
                    <Slider.Root
                      defaultValue={[40]}
                      colorPalette={palette}
                      size={size}
                      style={{ 'min-width': '160px' }}
                    >
                      <Slider.Control>
                        <Slider.Track>
                          <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumbs />
                      </Slider.Control>
                    </Slider.Root>
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

/** Compare both slider variants across ten palettes. */
export function SliderVariants(): JSX.Element {
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
                    <Slider.Root
                      defaultValue={[40]}
                      colorPalette={palette}
                      variant={variant}
                      style={{ 'min-width': '200px', 'margin-bottom': 'var(--leverui-spacing-2)' }}
                    >
                      <Slider.Control>
                        <Slider.Track>
                          <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumbs />
                      </Slider.Control>
                    </Slider.Root>
                    <Slider.Root
                      defaultValue={[40]}
                      colorPalette={palette}
                      variant={variant}
                      style={{ 'min-width': '200px' }}
                      disabled
                    >
                      <Slider.Control>
                        <Slider.Track>
                          <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumbs />
                      </Slider.Control>
                    </Slider.Root>
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
