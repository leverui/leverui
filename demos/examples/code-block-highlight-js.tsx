import { type JSX } from '@solidjs/web';
import { CodeBlock } from '../../src';
import 'highlight.js/styles/github-dark.css';
import { referenceHighlightJsAdapter } from './code-block-adapters';
import { htmlFile } from './code-block-data';
import './code-block-example-layout.css';

/** Render the HTML sample through the alternate Highlight.js adapter. */
export function CodeBlockWithHighlightJs(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceHighlightJsAdapter}>
      <CodeBlock.Root code={htmlFile.code} language={htmlFile.language}>
        <CodeBlock.Header>
          <CodeBlock.Title>{htmlFile.title}</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}
