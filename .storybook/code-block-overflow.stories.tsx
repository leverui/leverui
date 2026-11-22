import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import 'highlight.js/styles/github-dark.css';
import { CodeBlock } from '../src';
import { highlightJsAdapter } from './code-block-highlightjs-adapter';
import overflowData from './code-block-overflow-data.json' with { type: 'json' };

/** Compare horizontal scrolling and numbered wrapping on one mounted block. */
function CodeBlockOverflow(): JSX.Element {
  const [wrapped, setWrapped] = createSignal(false);

  /** Toggle only the wrapping metadata while retaining the source nodes. */
  function toggleWrap(): void {
    setWrapped(!wrapped());
  }

  return (
    <>
      <CodeBlock.AdapterProvider value={highlightJsAdapter}>
        <button type="button" onClick={toggleWrap} data-testid="overflow-toggle">
          Toggle wrapping
        </button>
        <CodeBlock.Root
          code={overflowData.source}
          language="tsx"
          meta={{ showLineNumbers: true, wordWrap: wrapped() }}
          style={{ width: '320px' }}
          data-testid="overflow-root"
        >
          <CodeBlock.Content>
            <CodeBlock.Code data-testid="overflow-pre">
              <CodeBlock.CodeText data-testid="overflow-code" />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
    </>
  );
}

const meta = {
  title: 'Content/Code Block Overflow',
  component: CodeBlockOverflow,
} satisfies Meta<typeof CodeBlockOverflow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
