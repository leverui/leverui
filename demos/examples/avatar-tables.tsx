import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, HStack, Span } from '../../src';
import { colorPalettes } from './playground-matrix';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const variants = ['solid', 'subtle', 'outline'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare every Avatar size except percentage-based full. */
export function AvatarSizeTable(): JSX.Element {
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
                    <HStack>
                      <Avatar.Root colorPalette={palette} size={size}>
                        <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
                        <Avatar.Fallback name="Theo Park" />
                      </Avatar.Root>
                      <Avatar.Root colorPalette={palette} size={size}>
                        <Avatar.Image />
                        <Avatar.Fallback name="Theo Park" />
                      </Avatar.Root>
                      <Avatar.Root colorPalette={palette} size={size}>
                        <Avatar.Image />
                        <Avatar.Fallback />
                      </Avatar.Root>
                    </HStack>
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

/** Compare all Avatar surfaces across the palettes. */
export function AvatarVariantTable(): JSX.Element {
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
                    <HStack>
                      <Avatar.Root colorPalette={palette} variant={variant}>
                        <Avatar.Image src="/demo-images/avatars/avatar-4.webp" />
                        <Avatar.Fallback name="Jonah Reyes" />
                      </Avatar.Root>
                      <Avatar.Root colorPalette={palette} variant={variant}>
                        <Avatar.Fallback name="Jonah Reyes" />
                      </Avatar.Root>
                      <Avatar.Root colorPalette={palette} variant={variant}>
                        <Avatar.Fallback />
                      </Avatar.Root>
                    </HStack>
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
