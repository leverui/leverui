import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, CodeBlock, HStack, IconButton, Select, Span } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { codeLanguages, isCodeLanguage, languageCollection } from './code-block-switch-data';
import './code-block-example-layout.css';

/** Show the two language choices beneath the current Select root. */
function LanguageChoices(): JSX.Element {
  return (
    <Select.Positioner class="example-code-select-positioner">
      <Select.Content>
        <Select.List>
          <For each={languageCollection.items}>
            {
              /** Keep the selected item bound to its collection object. */
              (item) => (
                <Select.Item item={item}>
                  <img
                    src={`/demo-images/languages/${item.value}.svg`}
                    alt=""
                    width="14"
                    height="14"
                  />
                  <Select.ItemText>{item.value}</Select.ItemText>
                </Select.Item>
              )
            }
          </For>
        </Select.List>
      </Select.Content>
    </Select.Positioner>
  );
}

/** Switch the API sample between Python and TypeScript. */
export function CodeBlockWithLanguageSwitcher(): JSX.Element {
  const select = Select.useSelect({
    collection: languageCollection,
    defaultValue: ['python'],
    positioning: { strategy: 'fixed' },
  });

  /** Read the current machine selection for the code sample. */
  function selectedFile(): (typeof codeLanguages)[keyof typeof codeLanguages] {
    const selected = select().selectedItems[0]?.value;
    return selected && isCodeLanguage(selected) ? codeLanguages[selected] : codeLanguages.python;
  }

  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <CodeBlock.Root code={selectedFile().code} language={selectedFile().value} size="lg">
        <CodeBlock.Header>
          <HStack style={{ flex: '1' }}>
            <Badge colorPalette="teal" style={{ 'font-weight': 'bold' }}>
              POST
            </Badge>
            <Span textStyle="xs">/v1/search</Span>
          </HStack>
          <CodeBlock.Control>
            <Select.RootProvider value={select} size="xs" variant="subtle">
              <Select.Control>
                <Select.Trigger aria-label="Code language">
                  <Select.ValueText />
                  <Select.Indicator />
                </Select.Trigger>
              </Select.Control>
              <LanguageChoices />
            </Select.RootProvider>
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
          <CodeBlock.Code class="example-code-xs">
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}
