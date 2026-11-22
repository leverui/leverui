import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import 'highlight.js/styles/github-dark.css';
import { CodeBlock } from '../src';
import { highlightJsAdapter } from './code-block-highlightjs-adapter';

const examples = {
  tsx: { title: 'example.tsx', code: 'const ready = true\nconsole.log(ready)' },
  html: { title: 'example.html', code: '<strong>Ready</strong>\n<p>Visible</p>' },
} as const;

type ExampleLanguage = keyof typeof examples;

/** Narrow native select values to the example's registered languages. */
function isExampleLanguage(value: string): value is ExampleLanguage {
  return value === 'tsx' || value === 'html';
}

/** Exercise a real, asynchronously loaded Highlight.js consumer adapter. */
function HighlightJsExample(): JSX.Element {
  const [language, setLanguage] = createSignal<ExampleLanguage>('tsx');

  /** Change source and grammar without replacing the mounted Code Block. */
  function changeLanguage(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLSelectElement && isExampleLanguage(target.value)) {
      setLanguage(target.value);
    }
  }

  return (
    <>
      <CodeBlock.AdapterProvider value={highlightJsAdapter}>
        <label for="highlight-js-language">Language</label>
        <select id="highlight-js-language" value={language()} onChange={changeLanguage}>
          <option value="tsx">TSX</option>
          <option value="html">HTML</option>
        </select>
        <CodeBlock.Root
          code={examples[language()].code}
          language={language()}
          meta={{ showLineNumbers: true, highlightLines: [2], addedLineNumbers: [2] }}
          data-testid="highlight-js-root"
        >
          <CodeBlock.Header>
            <CodeBlock.Title data-testid="highlight-js-title">
              {examples[language()].title}
            </CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code data-testid="highlight-js-pre">
              <CodeBlock.CodeText data-testid="highlight-js-code" />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
    </>
  );
}

const meta = {
  title: 'Content/Code Block Highlight.js',
  component: HighlightJsExample,
} satisfies Meta<typeof HighlightJsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
