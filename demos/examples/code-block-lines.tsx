import { type JSX } from '@solidjs/web';
import { CodeBlock } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { diffFile, focusFile, htmlFile } from './code-block-data';
import './code-block-example-layout.css';

/** Dim all but the two focused TypeScript lines. */
export function CodeBlockWithLineFocus(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        code={focusFile.code}
        language={focusFile.language}
        meta={{ focusedLineNumbers: [3, 7] }}
      >
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}

/** Highlight the first two HTML lines. */
export function CodeBlockWithLineHighlight(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        code={htmlFile.code}
        language={htmlFile.language}
        meta={{ highlightLines: [2, 1] }}
      >
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}

/** Number each source line in the HTML sample. */
export function CodeBlockWithLineNumbers(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        code={htmlFile.code}
        language={htmlFile.language}
        meta={{ showLineNumbers: true }}
      >
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}

/** Mark the added and removed lines in the diff sample. */
export function CodeBlockWithDiff(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        code={diffFile.code}
        language={diffFile.language}
        meta={{ showLineNumbers: true, addedLineNumbers: [4], removedLineNumbers: [3] }}
      >
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}
