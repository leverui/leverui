import { type JSX } from '@solidjs/web';
import { FileCodeIcon, SquareArrowOutUpRightIcon } from '@lucide/solid';
import { CodeBlock, IconButton } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { htmlFile } from './code-block-data';
import './code-block-example-layout.css';

/** Show the syntax-highlighted HTML block. */
export function CodeBlockBasic(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={htmlFile.code} language={htmlFile.language}>
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}

/** Add a file title and copy control to the HTML sample. */
export function CodeBlockWithCopyButton(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={htmlFile.code} language={htmlFile.language}>
        <CodeBlock.Header>
          <CodeBlock.Title>{htmlFile.title}</CodeBlock.Title>
          <CodeBlock.CopyTrigger
            aria-label="Copy to clipboard"
            asChild={
              /** Preserve the copy contract on the styled icon button. */
              (getProps) => (
                <IconButton
                  {...getProps()}
                  variant="ghost"
                  size="2xs"
                  aria-label="Copy to clipboard"
                >
                  <CodeBlock.CopyIndicator />
                </IconButton>
              )
            }
          />
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

/** Show the CodeSandbox-shaped custom action. */
export function CodeBlockWithCustomAction(): JSX.Element {
  /** Announce the action without opening an external service. */
  function openSandbox(): void {
    window.alert('Open in sandbox');
  }

  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={htmlFile.code} language={htmlFile.language}>
        <CodeBlock.Header>
          <CodeBlock.Title>{htmlFile.title}</CodeBlock.Title>
          <CodeBlock.CopyTrigger
            aria-label="Copy to clipboard"
            asChild={
              /** Preserve the copy contract on the styled icon button. */
              (getProps) => (
                <IconButton
                  {...getProps()}
                  variant="ghost"
                  size="2xs"
                  aria-label="Copy to clipboard"
                >
                  <CodeBlock.CopyIndicator />
                </IconButton>
              )
            }
          />
          <IconButton variant="ghost" size="2xs" aria-label="Open in sandbox" onClick={openSandbox}>
            <SquareArrowOutUpRightIcon />
          </IconButton>
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

/** Show the HTML file title and orange document glyph. */
export function CodeBlockWithTitle(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={htmlFile.code} language={htmlFile.language}>
        <CodeBlock.Header>
          <CodeBlock.Title>
            <FileCodeIcon style={{ color: 'var(--leverui-colors-orange-300)' }} />
            {htmlFile.title}
          </CodeBlock.Title>
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
