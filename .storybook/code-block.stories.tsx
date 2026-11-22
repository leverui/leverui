import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CodeBlock, createHighlightJsAdapter, type UseCodeBlockContext } from '../src';
import './code-block-overrides.css';

const code = 'const ready = true\nconsole.log(ready)\nreturn ready';
const longCode = 'const ready = true\nconsole.log(ready)\nreturn ready\n// finished';

const highlighter = {
  /** Return escaped fixture markup with one syntax token. */
  highlight(source: string): { value: string } {
    return {
      value: source.replace('const', '<span style="color: rgb(31, 120, 180)">const</span>'),
    };
  },
  /** Report the fake adapter's supported fixture language. */
  listLanguages(): string[] {
    return ['tsx'];
  },
  /** Release a fixture language without affecting the story. */
  unregisterLanguage(): void {},
};

const adapter = createHighlightJsAdapter({
  /** Load the same highlighter after the Storybook client mounts. */
  async load() {
    return highlighter;
  },
  /** Render highlighted source on the first pass. */
  loadSync() {
    return highlighter;
  },
});

/** Show every Code Block part, size, and reactive source path. */
function CodeBlockMatrix(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [extended, setExtended] = createSignal(false);
  const [copies, setCopies] = createSignal(0);

  /** Change the mounted block's finite size. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change source text without remounting the pre or code elements. */
  function toggleSource(): void {
    setExtended(!extended());
  }

  /** Count completed clipboard operations from the primitive layer. */
  function recordCopy(): void {
    setCopies(
      /** Advance the observed successful-copy count. */
      (count) => count + 1,
    );
  }

  /** Display the live source exposed by the compound context. */
  function renderSourceState(context: UseCodeBlockContext): JSX.Element {
    return <span data-testid="code-block-context">{context.code()}</span>;
  }

  return (
    <>
      <CodeBlock.AdapterProvider value={adapter}>
        <CodeBlock.Root
          code={extended() ? longCode : code}
          language="tsx"
          size={large() ? 'lg' : 'sm'}
          maxLines={2}
          onCopy={recordCopy}
          meta={{
            showLineNumbers: true,
            highlightLines: [2],
            addedLineNumbers: [2],
            removedLineNumbers: [3],
            focusedLineNumbers: [1],
            wordWrap: true,
          }}
          id="code-block-css-override"
          data-testid="code-block-root"
        >
          <CodeBlock.Header data-testid="code-block-header">
            <CodeBlock.Title data-testid="code-block-title">example.ts</CodeBlock.Title>
            <CodeBlock.Control data-testid="code-block-control">
              <CodeBlock.CopyTrigger data-testid="code-block-copy" aria-label="Copy code">
                <CodeBlock.CopyIndicator copied="Copied">Copy</CodeBlock.CopyIndicator>
              </CodeBlock.CopyTrigger>
              <CodeBlock.CollapseTrigger data-testid="code-block-collapse">
                <CodeBlock.CollapseText />
              </CodeBlock.CollapseTrigger>
            </CodeBlock.Control>
          </CodeBlock.Header>
          <CodeBlock.Content data-testid="code-block-content">
            <CodeBlock.Code data-testid="code-block-pre">
              <CodeBlock.CodeText data-testid="code-block-code" />
            </CodeBlock.Code>
            <CodeBlock.Overlay data-testid="code-block-overlay">
              Expand to view more
            </CodeBlock.Overlay>
          </CodeBlock.Content>
          <CodeBlock.Footer data-testid="code-block-footer">Source</CodeBlock.Footer>
          <CodeBlock.Context>{renderSourceState}</CodeBlock.Context>
          <span data-testid="code-block-copy-count">{copies()}</span>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
      <CodeBlock.Root code={code} size="md" data-testid="code-block-plain-root">
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText data-testid="code-block-plain" />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
      <CodeBlock.Root code="default" data-testid="code-block-default-root">
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
      <CodeBlock.Root
        code={code}
        size="lg"
        meta={{ colorScheme: 'light' }}
        data-testid="code-block-light-root"
      >
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText data-testid="code-block-light" />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
      <CodeBlock.Root
        code={code}
        size={{ base: 'sm', md: 'lg' }}
        data-testid="code-block-responsive-root"
      >
        <CodeBlock.Header data-testid="code-block-responsive-header">
          <CodeBlock.Title data-testid="code-block-responsive-title">responsive.ts</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code data-testid="code-block-responsive-pre">
            <CodeBlock.CodeText data-testid="code-block-responsive-code" />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
      <button type="button" data-testid="code-block-size-toggle" onClick={toggleSize}>
        Toggle size
      </button>
      <button type="button" data-testid="code-block-source-toggle" onClick={toggleSource}>
        Toggle source
      </button>
    </>
  );
}

const meta = {
  title: 'Content/Code Block',
  component: CodeBlockMatrix,
} satisfies Meta<typeof CodeBlockMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
