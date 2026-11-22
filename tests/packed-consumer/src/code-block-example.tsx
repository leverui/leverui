import { CodeBlock, plainTextAdapter } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed compound API, controls, and native CSS. */
export function PackedCodeBlock(): JSX.Element {
  const [extended, setExtended] = createSignal(false);

  /** Change mounted source without replacing its native code element. */
  function toggleSource(): void {
    setExtended(!extended());
  }

  return (
    <>
      <CodeBlock.AdapterProvider value={plainTextAdapter}>
        <CodeBlock.Root
          id="packed-code-block"
          class="packed-code-block"
          code={extended() ? 'first\nsecond\nthird' : 'first\nsecond'}
          maxLines={1}
          meta={{ showLineNumbers: true }}
        >
          <CodeBlock.Header>
            <CodeBlock.Title>example.ts</CodeBlock.Title>
            <CodeBlock.Control>
              <CodeBlock.CopyTrigger id="packed-code-block-copy" aria-label="Copy code">
                <CodeBlock.CopyIndicator copied="Copied">Copy</CodeBlock.CopyIndicator>
              </CodeBlock.CopyTrigger>
              <CodeBlock.CollapseTrigger id="packed-code-block-collapse">
                <CodeBlock.CollapseText />
              </CodeBlock.CollapseTrigger>
            </CodeBlock.Control>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText id="packed-code-block-code" />
            </CodeBlock.Code>
            <CodeBlock.Overlay>Expand code</CodeBlock.Overlay>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
      <CodeBlock.PropsProvider
        value={{
          as: 'section',
          title: 'Packed shared code',
          class: 'packed-code-block-provider',
          style: { 'border-width': '3px' },
        }}
      >
        <CodeBlock.Root code="Inherited source" id="packed-code-block-provider">
          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
        <CodeBlock.Root
          as="div"
          code="Local source"
          id="packed-code-block-provider-override"
          class="packed-code-block-local"
        >
          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.PropsProvider>
      <button id="packed-code-block-toggle" type="button" onClick={toggleSource}>
        Change source
      </button>
    </>
  );
}
