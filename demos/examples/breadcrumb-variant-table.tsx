import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Breadcrumb, Span, Stack } from '../../src';

const colorPalettes = [
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
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;
const labelStyle = {
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'min-width': '8ch',
} as const;

/** Show all Breadcrumb variants across the ten palettes. */
export function BreadcrumbVariantTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={['plain', 'underline'] as const}>
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
                <Span style={labelStyle}>{palette}</Span>
              </th>
              <For each={['plain', 'underline'] as const}>
                {(variant) => (
                  <td style={cellStyle}>
                    <Stack>
                      <Breadcrumb.Root variant={variant} colorPalette={palette}>
                        <Breadcrumb.List>
                          <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                            <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
                          </Breadcrumb.Item>
                        </Breadcrumb.List>
                      </Breadcrumb.Root>
                      <Breadcrumb.Root variant={variant} colorPalette={palette}>
                        <Breadcrumb.List>
                          <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator>/</Breadcrumb.Separator>
                          <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator>/</Breadcrumb.Separator>
                          <Breadcrumb.Item>
                            <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
                          </Breadcrumb.Item>
                        </Breadcrumb.List>
                      </Breadcrumb.Root>
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
