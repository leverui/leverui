import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span, Tabs, Text } from '../../src';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['line', 'subtle', 'enclosed', 'outline', 'plain'] as const;
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

/** Compare every size within each variant. */
export function TabsSizes(): JSX.Element {
  return (
    <table style={{ width: '100%', 'border-collapse': 'collapse' }}>
      <thead
        style={{
          'font-size': '0.875rem',
          'line-height': '1.5',
          color: 'var(--lui-colors-fg-muted)',
        }}
      >
        <tr>
          <td style={cellStyle} />
          <For each={sizes}>{(size) => <td style={cellStyle}>{size}</td>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={variants}>
          {(variant) => (
            <tr>
              <td style={cellStyle}>
                <Span style={labelStyle}>{variant}</Span>
              </td>
              <For each={sizes}>
                {(size) => (
                  <td style={cellStyle}>
                    <Tabs.Root
                      defaultValue="settings"
                      size={size}
                      variant={variant}
                      style={{ 'margin-top': 'var(--lui-spacing-3)', 'min-width': '300px' }}
                    >
                      <Tabs.List>
                        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.ContentGroup>
                        <Tabs.Content value="settings">
                          <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
                            Change your workspace name, language, and time zone.
                          </Text>
                        </Tabs.Content>
                        <Tabs.Content value="billing">
                          <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
                            Update your payment card and download past invoices.
                          </Text>
                        </Tabs.Content>
                      </Tabs.ContentGroup>
                    </Tabs.Root>
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

/** Compare five tab variants across the ten palettes. */
export function TabsVariants(): JSX.Element {
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
                <Span style={labelStyle}>{palette}</Span>
              </th>
              <For each={variants}>
                {(variant) => (
                  <td style={cellStyle}>
                    <Tabs.Root
                      defaultValue="settings"
                      variant={variant}
                      colorPalette={palette}
                      style={{ 'margin-top': 'var(--lui-spacing-3)', 'min-width': '300px' }}
                    >
                      <Tabs.List>
                        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.ContentGroup>
                        <Tabs.Content value="settings">
                          <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
                            Change your workspace name, language, and time zone.
                          </Text>
                        </Tabs.Content>
                        <Tabs.Content value="billing">
                          <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
                            Update your payment card and download past invoices.
                          </Text>
                        </Tabs.Content>
                      </Tabs.ContentGroup>
                    </Tabs.Root>
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
