import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckboxCard, Span, Stack, type CheckboxCardRootProps } from '../../src';
import { colorPalettes } from './playground-matrix';
import './checkbox-card-layout.css';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['surface', 'subtle', 'outline', 'solid'] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;

/** Compare all Checkbox Card variants across the palettes. */
export function CheckboxCardVariantTable(): JSX.Element {
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
                    <Stack gap="4">
                      <DemoCheckboxCard variant={variant} colorPalette={palette} />
                      <DemoCheckboxCard variant={variant} colorPalette={palette} defaultChecked />
                      <DemoCheckboxCard
                        variant={variant}
                        colorPalette={palette}
                        defaultChecked
                        disabled
                      />
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

/** Compare checked outline and subtle cards at each size. */
export function CheckboxCardSizeTable(): JSX.Element {
  return (
    <table class="checkbox-card-example-table">
      <thead>
        <tr>
          <td />
          <For each={sizes}>{(size) => <td>{size}</td>}</For>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td />
          <For each={sizes}>
            {(size) => (
              <td>
                <Stack gap="4">
                  <DemoCheckboxCard size={size} variant="outline" defaultChecked />
                  <DemoCheckboxCard size={size} variant="subtle" defaultChecked />
                </Stack>
              </td>
            )}
          </For>
        </tr>
      </tbody>
    </table>
  );
}

/** Render the title, description, and indicator for one demo card. */
function DemoCheckboxCard(props: CheckboxCardRootProps): JSX.Element {
  return (
    <CheckboxCard.Root class="example-checkbox-card-sample" {...props}>
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Next.js</CheckboxCard.Label>
          <CheckboxCard.Description>For full-stack apps</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}
