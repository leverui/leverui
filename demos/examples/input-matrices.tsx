import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Input, Span, Stack } from '../../src';
import './input-placeholder.css';

/** Show the default email placeholder. */
export function InputBasic(): JSX.Element {
  return <Input placeholder="Enter your email" />;
}

/** Compare the subtle, outline, and flushed input treatments. */
export function InputVariants(): JSX.Element {
  return (
    <Stack gap="4">
      <Input placeholder="Subtle" variant="subtle" />
      <Input placeholder="Outline" variant="outline" />
      <Input placeholder="Flushed" variant="flushed" />
    </Stack>
  );
}

/** Compare four input sizes with their own placeholders. */
export function InputSizes(): JSX.Element {
  return (
    <Stack gap="4">
      <Input placeholder="size (xs)" size="xs" />
      <Input placeholder="size (sm)" size="sm" />
      <Input placeholder="size (md)" size="md" />
      <Input placeholder="size (lg)" size="lg" />
    </Stack>
  );
}

/** Disable the native input with its placeholder. */
export function InputDisabled(): JSX.Element {
  return <Input disabled placeholder="disabled" />;
}

/** Style the placeholder through ordinary CSS. */
export function InputPlaceholderStyle(): JSX.Element {
  return <Input class="input-placeholder-example" placeholder="custom placeholder" />;
}

/** Compare the seven CSS sizes in outline and subtle variants. */
export function InputSizeMatrix(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <tbody>
        <For each={['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const}>
          {
            /** Pair each size with the two surfaces. */
            (size) => (
              <tr>
                <td style={{ 'padding-right': '32px', 'padding-bottom': '32px' }}>
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
                <td style={{ 'padding-right': '32px', 'padding-bottom': '32px' }}>
                  <Stack>
                    <Input size={size} placeholder="Placeholder" />
                    <Input variant="subtle" size={size} placeholder="Placeholder" />
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

/** Compare all styled variants and an unstyled input. */
export function InputVariantMatrix(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <tbody>
        <For each={['outline', 'subtle', 'flushed'] as const}>
          {
            /** Render one named variant in the table. */
            (variant) => (
              <tr>
                <td style={{ 'padding-right': '32px', 'padding-bottom': '32px' }}>
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
                <td style={{ 'padding-right': '32px', 'padding-bottom': '32px' }}>
                  <Input variant={variant} placeholder="Placeholder" />
                </td>
              </tr>
            )
          }
        </For>
        <tr>
          <td style={{ 'padding-right': '32px', 'padding-bottom': '32px' }}>
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
          <td style={{ 'padding-right': '32px', 'padding-bottom': '32px' }}>
            <Input unstyled placeholder="Placeholder" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
