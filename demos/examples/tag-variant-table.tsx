import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Span, Stack, Tag } from '../../src';
import { colorPalettes } from './playground-matrix';
import { Briefcase, Check } from '@lucide/solid';

const variants = ['subtle', 'solid', 'outline', 'surface'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare every tag variant in all ten palettes. */
export function TagVariantTable(): JSX.Element {
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
                    <Stack align="flex-start">
                      <Tag.Root variant={variant} colorPalette={palette}>
                        <Tag.Label>Gray</Tag.Label>
                      </Tag.Root>
                      <Tag.Root variant={variant} colorPalette={palette}>
                        <Tag.Label>Gray</Tag.Label>
                        <Tag.EndElement>
                          <Tag.CloseTrigger />
                        </Tag.EndElement>
                      </Tag.Root>
                      <Tag.Root variant={variant} colorPalette={palette}>
                        <Tag.StartElement>
                          <Check />
                        </Tag.StartElement>
                        <Tag.Label>Gray</Tag.Label>
                      </Tag.Root>
                      <Tag.Root variant={variant} colorPalette={palette}>
                        <Tag.StartElement>
                          <Briefcase />
                        </Tag.StartElement>
                        <Tag.Label>Projects</Tag.Label>
                      </Tag.Root>
                      <Tag.Root
                        variant={variant}
                        colorPalette={palette}
                        style={{ 'border-radius': '9999px' }}
                      >
                        <Tag.StartElement>
                          <Avatar.Root size="full">
                            <Avatar.Image src="/demo-images/avatars/avatar-3.webp" />
                            <Avatar.Fallback name="Nadia Quill" />
                          </Avatar.Root>
                        </Tag.StartElement>
                        <Tag.Label>Nadia Quill</Tag.Label>
                      </Tag.Root>
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
