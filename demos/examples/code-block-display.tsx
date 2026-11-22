import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CodeBlock, Float, IconButton, Stack } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { htmlFile, wrappedFile } from './code-block-data';
import { maxLinesFile, terminalFile } from './code-block-long-data';
import './code-block-example-layout.css';

/** Collapse the long code sample after ten lines. */
export function CodeBlockWithMaxLines(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={maxLinesFile.code} language={maxLinesFile.language} maxLines={10}>
        <CodeBlock.Header>
          <CodeBlock.Title>{maxLinesFile.title}</CodeBlock.Title>
          <CodeBlock.Control>
            <CodeBlock.CollapseTrigger
              asChild={
                /** Keep CodeBlock's collapse behavior on the styled icon button. */
                (getProps) => (
                  <IconButton {...getProps()} variant="ghost" size="2xs">
                    <CodeBlock.CollapseIndicator />
                  </IconButton>
                )
              }
            />
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
          </CodeBlock.Control>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
          <CodeBlock.Overlay>
            <CodeBlock.CollapseTrigger>
              <CodeBlock.CollapseText class="example-code-collapse-text" />
            </CodeBlock.CollapseTrigger>
          </CodeBlock.Overlay>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}

/** Wrap the long greeting inside a medium-width block. */
export function CodeBlockWithWordWrap(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        class="example-code-medium-width"
        code={wrappedFile.code}
        language={wrappedFile.language}
        meta={{ wordWrap: true }}
      >
        <CodeBlock.Header>
          <CodeBlock.Title>{wrappedFile.title}</CodeBlock.Title>
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

/** Wrap terminal output while retaining its line-number gutter. */
export function CodeBlockWithLineNumbersWordWrap(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        class="example-code-medium-width"
        code={terminalFile.code}
        language={terminalFile.language}
        meta={{ showLineNumbers: true, wordWrap: true }}
      >
        <CodeBlock.Header>
          <CodeBlock.Title>{terminalFile.title}</CodeBlock.Title>
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

const sizes = ['sm', 'md', 'lg'] as const;

/** Compare the three CodeBlock size variants. */
export function CodeBlockWithSizes(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <Stack gap="8">
        <For each={sizes}>
          {(size) => (
            <CodeBlock.Root code={htmlFile.code} language={htmlFile.language} size={size}>
              <CodeBlock.Header>
                <CodeBlock.Title>(size={size})</CodeBlock.Title>
              </CodeBlock.Header>
              <CodeBlock.Content>
                <CodeBlock.Code>
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          )}
        </For>
      </Stack>
    </CodeBlock.AdapterProvider>
  );
}

/** Place the copy action at the top-right content edge. */
export function CodeBlockWithFloatingCopyButton(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={htmlFile.code} language={htmlFile.language}>
        <CodeBlock.Content>
          <Float placement="top-end" offset="5" style={{ 'z-index': '1' }}>
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
          </Float>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}
