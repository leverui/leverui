import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CodeBlock, Float } from '../src';
import { codeCompositionAdapter } from './code-block-composition-adapter';
import { codeFiles, isCodeLanguage, type CodeLanguage } from './code-block-composition-data';
import { SyncedCodeTabs } from './code-block-composition-tabs';

/** Exercise language switching, floating copy, theme changes, and linked tabs. */
function CodeBlockCompositions(): JSX.Element {
  const [language, setLanguage] = createSignal<CodeLanguage>('typescript');
  const [light, setLight] = createSignal(false);

  /** Update the mounted block from a native consumer-owned select. */
  function changeLanguage(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLSelectElement && isCodeLanguage(target.value)) {
      setLanguage(target.value);
    }
  }

  /** Toggle the explicit Code Block color scheme without replacing source. */
  function toggleTheme(): void {
    setLight(!light());
  }

  return (
    <>
      <CodeBlock.AdapterProvider value={codeCompositionAdapter}>
        <label for="code-block-language">Language</label>
        <select id="code-block-language" value={language()} onChange={changeLanguage}>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
        </select>
        <button type="button" onClick={toggleTheme} data-testid="code-block-theme-toggle">
          Toggle code theme
        </button>
        <CodeBlock.Root
          code={codeFiles[language()].code}
          language={language()}
          meta={{ colorScheme: light() ? 'light' : 'dark', wordWrap: true }}
          style={{ 'max-width': '240px' }}
          data-testid="switcher-root"
        >
          <CodeBlock.Header>
            <CodeBlock.Title data-testid="switcher-title">
              {codeFiles[language()].title}
            </CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <Float
              placement="top-end"
              offset="2"
              style={{ 'z-index': '2' }}
              data-testid="floating-copy"
            >
              <CodeBlock.CopyTrigger aria-label="Copy selected code" data-testid="switcher-copy">
                <CodeBlock.CopyIndicator />
              </CodeBlock.CopyTrigger>
            </Float>
            <CodeBlock.Code>
              <CodeBlock.CodeText data-testid="switcher-code" />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
        <SyncedCodeTabs name="first" />
        <SyncedCodeTabs name="second" />
      </CodeBlock.AdapterProvider>
    </>
  );
}

const meta = {
  title: 'Content/Code Block Compositions',
  component: CodeBlockCompositions,
} satisfies Meta<typeof CodeBlockCompositions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
