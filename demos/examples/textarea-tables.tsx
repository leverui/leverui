import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span, Stack, Textarea } from '../../src';
import { textareaSizes, textareaVariants } from '../../src/components/textarea-options';

const tableStyle = {
  width: '100%',
  'margin-bottom': '32px',
  'border-collapse': 'collapse',
} as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;

/** Compare outline and subtle textareas for all five sizes. */
export function TextareaSizeTable(): JSX.Element {
  return (
    <table style={tableStyle}>
      <tbody>
        <For each={textareaSizes}>
          {
            /** Render one labeled size row. */
            (size) => (
              <tr>
                <td style={cellStyle}>
                  <Span
                    style={{
                      'font-size': 'var(--leverui-font-sizes-sm)',
                      color: 'var(--leverui-colors-fg-muted)',
                      'min-width': '8ch',
                    }}
                  >
                    {size}
                  </Span>
                </td>
                <td style={cellStyle}>
                  <Stack style={{ 'min-width': '320px' }}>
                    <Textarea size={size} placeholder="Placeholder" />
                    <Textarea variant="subtle" size={size} placeholder="Placeholder" />
                  </Stack>
                </td>
              </tr>
            )
          }
        </For>
      </tbody>
    </table>
  );
}

/** Compare all three authored variants and unstyled rendering. */
export function TextareaVariantTable(): JSX.Element {
  return (
    <table style={tableStyle}>
      <tbody>
        <For each={textareaVariants}>
          {
            /** Render one labeled variant row. */
            (variant) => (
              <tr>
                <td style={cellStyle}>
                  <Span
                    style={{
                      'font-size': 'var(--leverui-font-sizes-sm)',
                      color: 'var(--leverui-colors-fg-muted)',
                      'min-width': '8ch',
                    }}
                  >
                    {variant}
                  </Span>
                </td>
                <td style={cellStyle}>
                  <Textarea variant={variant} placeholder="Placeholder" />
                </td>
              </tr>
            )
          }
        </For>
        <tr>
          <td style={cellStyle}>
            <Span
              style={{
                'font-size': 'var(--leverui-font-sizes-sm)',
                color: 'var(--leverui-colors-fg-muted)',
                'min-width': '8ch',
              }}
            >
              unstyled
            </Span>
          </td>
          <td style={cellStyle}>
            <Textarea unstyled style={{ 'min-width': '320px' }} placeholder="Placeholder" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
