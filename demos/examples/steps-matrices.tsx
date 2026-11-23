import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Span, Steps, type StepsRootProps } from '../../src';
import './steps-matrices.css';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['solid', 'subtle'] as const;
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

/** Compare the four sizes within each of the two CSS variants. */
export function StepsSizes(): JSX.Element {
  return (
    <table style={{ width: '100%', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <td />
          <For each={sizes}>{(size) => <td style={cellStyle}>{size}</td>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={variants}>
          {(variant) => (
            <tr>
              <td style={cellStyle}>
                <Span
                  style={{
                    'font-size': 'var(--lui-font-sizes-sm)',
                    color: 'var(--lui-colors-fg-muted)',
                    'min-width': '8ch',
                  }}
                >
                  {variant}
                </Span>
              </td>
              <For each={sizes}>
                {(size) => (
                  <td style={cellStyle}>
                    <DemoSteps size={size} variant={variant} />
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

/** Compare both variants across the ten color palettes. */
export function StepsVariants(): JSX.Element {
  return (
    <table style={{ width: '100%', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <td />
          <For each={variants}>{(variant) => <td style={cellStyle}>{variant}</td>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={colorPalettes}>
          {(palette) => (
            <tr>
              <td style={cellStyle}>
                <Span
                  style={{
                    'font-size': 'var(--lui-font-sizes-sm)',
                    color: 'var(--lui-colors-fg-muted)',
                    'min-width': '8ch',
                  }}
                >
                  {palette}
                </Span>
              </td>
              <For each={variants}>
                {(variant) => (
                  <td style={cellStyle}>
                    <DemoSteps variant={variant} colorPalette={palette} />
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

const items = [
  { title: 'Step 1', description: 'Step 1 description' },
  { title: 'Step 2', description: 'Step 2 description' },
  { title: 'Step 3', description: 'Step 3 description' },
] as const;

/** Render one complete three-step cell in a CSS variant matrix. */
function DemoSteps(props: StepsRootProps): JSX.Element {
  return (
    <Steps.Root
      items={items.map((_, index) => ({ value: `step-${index}` }))}
      defaultValue="step-1"
      defaultCompletedValues={['step-0']}
      class="steps-matrix-root"
      {...props}
    >
      <Steps.List>
        <For each={items}>
          {(item, index) => (
            <Steps.Item value={`step-${index()}`} title={item.title}>
              <Steps.Indicator />
              <Steps.Title>{item.title}</Steps.Title>
              <Steps.Separator />
            </Steps.Item>
          )}
        </For>
      </Steps.List>
      <For each={items}>
        {(item, index) => (
          <Steps.Content value={`step-${index()}`}>{item.description}</Steps.Content>
        )}
      </For>
      <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>
      <ButtonGroup size="sm" variant="outline">
        <Steps.PrevTrigger asChild={(getProps) => <Button {...getProps()}>Prev</Button>} />
        <Steps.NextTrigger asChild={(getProps) => <Button {...getProps()}>Next</Button>} />
      </ButtonGroup>
    </Steps.Root>
  );
}
