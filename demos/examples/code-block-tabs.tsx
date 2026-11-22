import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CodeBlock, IconButton, Tabs, type TabsValueChangeDetails } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { isTabLanguage, languageTabs, type TabLanguage } from './code-block-tabs-data';
import './code-block-example-layout.css';

/** Switch the displayed and copied source with the tab bar. */
export function CodeBlockWithTabs(): JSX.Element {
  const [value, setValue] = createSignal<TabLanguage>('python');

  /** Keep the active CodeBlock source aligned with the selected tab. */
  function changeTab(details: TabsValueChangeDetails): void {
    if (isTabLanguage(details.value)) setValue(details.value);
  }

  /** Resolve the selected source from the fixed tab list. */
  function activeFile(): (typeof languageTabs)[number] {
    return (
      languageTabs.find(
        /** Match the current language key. */
        (file) => file.language === value(),
      ) ?? languageTabs[0]
    );
  }

  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <Tabs.Root
        value={value()}
        onValueChange={changeTab}
        size="sm"
        variant="line"
        colorPalette="teal"
      >
        <CodeBlock.Root code={activeFile().code} language={activeFile().language}>
          <CodeBlock.Header class="example-code-tabs-header">
            <Tabs.List class="example-code-tabs-list">
              <For each={languageTabs}>
                {
                  /** Render one language tab from the list. */
                  (file) => (
                    <Tabs.Trigger value={file.language} class="example-code-tabs-trigger">
                      {file.title}
                    </Tabs.Trigger>
                  )
                }
              </For>
            </Tabs.List>
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
            <For each={languageTabs}>
              {
                /** Keep each panel registered while only the active one renders code. */
                (file) => (
                  <Tabs.Content class="example-code-tabs-content" value={file.language}>
                    <Show when={value() === file.language}>
                      <CodeBlock.Code>
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </Show>
                  </Tabs.Content>
                )
              }
            </For>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </Tabs.Root>
    </CodeBlock.AdapterProvider>
  );
}
