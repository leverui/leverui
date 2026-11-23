import { type JSX } from '@solidjs/web';
import { CodeBlock, Float, IconButton, Span, useMediaQuery } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { htmlFile } from './code-block-data';
import { overflowFile, overflowOverlayFile } from './code-block-overflow-data';
import './code-block-example-layout.css';

/** Follow the gallery color mode with the corresponding syntax theme. */
export function CodeBlockWithThemes(props: { mode?: 'light' | 'dark' | undefined }): JSX.Element {
  const prefersDark = useMediaQuery(['(prefers-color-scheme: dark)']);
  /** Prefer an explicit mode, then follow the system color scheme. */
  const colorScheme = () => props.mode ?? (prefersDark()[0] ? 'dark' : 'light');

  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        code={htmlFile.code}
        language={htmlFile.language}
        meta={{ colorScheme: colorScheme() }}
      >
        <CodeBlock.Content class="example-code-surface">
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}

const installCommand = 'npm install @leverui/components';

/** Show the copyable, unhighlighted install command. */
export function CodeBlockPlainText(): JSX.Element {
  return (
    <CodeBlock.Root code={installCommand} language="bash" class="example-code-inline">
      <CodeBlock.Content>
        <Float placement="middle-end" offsetX="6" style={{ 'z-index': '1' }}>
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
        <CodeBlock.Code class="example-code-end-padding">
          <Span
            style={{
              color: 'var(--lui-colors-fg-muted)',
              'margin-inline-start': 'var(--lui-spacing-4)',
              'user-select': 'none',
            }}
          >
            $
          </Span>
          <CodeBlock.CodeText class="example-code-inline-text" />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/** Keep long source lines horizontally scrollable. */
export function CodeBlockWithHorizontalOverflow(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={overflowFile.code} language={overflowFile.language}>
        <CodeBlock.Header>
          <CodeBlock.Title>{overflowFile.title}</CodeBlock.Title>
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

/** Keep the collapse overlay aligned over wide source code. */
export function CodeBlockWithOverflowAndOverlay(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root
        code={overflowOverlayFile.code}
        language={overflowOverlayFile.language}
        maxLines={10}
      >
        <CodeBlock.Header>
          <CodeBlock.Title>{overflowOverlayFile.title}</CodeBlock.Title>
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
          <Float placement="top-end" offset="5" style={{ 'z-index': '2' }}>
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
