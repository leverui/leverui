import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CodeBlock } from '../src';

/** Exercise inherited root attributes, styling, native tags, and live defaults. */
function CodeBlockProviderExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the shared size without replacing either root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <CodeBlock.PropsProvider
        value={{
          as: 'section',
          title: 'Shared code',
          class: 'shared-code-block',
          style: { 'border-width': '3px' },
          size: large() ? 'lg' : 'sm',
        }}
      >
        <CodeBlock.Root code="Inherited source" data-testid="code-block-provider-inherited">
          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
        <CodeBlock.Root
          as="div"
          code="Local source"
          title="Local code"
          class="local-code-block"
          style={{ 'border-width': '1px' }}
          data-testid="code-block-provider-override"
        >
          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.PropsProvider>
      <button type="button" data-testid="code-block-provider-toggle" onClick={toggleSize}>
        Toggle shared size
      </button>
    </>
  );
}

const meta = {
  title: 'Content/Code Block Provider',
  component: CodeBlockProviderExample,
} satisfies Meta<typeof CodeBlockProviderExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
