import { createSignal, For, onSettled, Show, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CodeBlock, IconButton, Stack, Tabs, type TabsValueChangeDetails } from '../../src';
import { referenceShikiAdapter } from './code-block-adapters';
import { installTabs, isPackageManager, type PackageManager } from './code-block-tabs-data';
import './code-block-example-layout.css';

const storageKey = 'leverui-code-block-tabs-sync';

interface CodeTabsProps {
  value: Accessor<PackageManager>;
  onChange: (value: PackageManager) => void;
}

/** Render one package-manager tab set bound to shared selection state. */
function CodeTabs(props: CodeTabsProps): JSX.Element {
  /** Send valid tab changes to the shared state owner. */
  function changeTab(details: TabsValueChangeDetails): void {
    if (isPackageManager(details.value)) props.onChange(details.value);
  }

  /** Resolve the command selected in both tab groups. */
  function activeFile(): (typeof installTabs)[number] {
    return (
      installTabs.find(
        /** Match the selected package manager. */
        (file) => file.title === props.value(),
      ) ?? installTabs[0]
    );
  }

  return (
    <Tabs.Root
      value={props.value()}
      onValueChange={changeTab}
      size="sm"
      variant="line"
      colorPalette="teal"
    >
      <CodeBlock.Root code={activeFile().code} language={activeFile().language}>
        <CodeBlock.Header class="example-code-tabs-header">
          <Tabs.List class="example-code-tabs-list">
            <For each={installTabs}>
              {
                /** Render one package-manager trigger. */
                (file) => (
                  <Tabs.Trigger value={file.title} class="example-code-tabs-trigger">
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
          <For each={installTabs}>
            {
              /** Keep only the selected panel's code mounted. */
              (file) => (
                <Tabs.Content class="example-code-tabs-content" value={file.title}>
                  <Show when={props.value() === file.title}>
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
  );
}

/** Synchronize the two tab groups and remember selection across reloads. */
export function CodeBlockWithTabsSync(): JSX.Element {
  const [value, setValue] = createSignal<PackageManager>('npm');

  /** Broadcast a local selection to both groups and browser storage. */
  function changeTab(next: PackageManager): void {
    setValue(next);
    window.localStorage.setItem(storageKey, next);
  }

  /** Follow a package-manager change from another browser tab. */
  function handleStorage(event: StorageEvent): void {
    if (event.key === storageKey && event.newValue && isPackageManager(event.newValue)) {
      setValue(event.newValue);
    }
  }

  onSettled(
    /** Restore the last selected manager and subscribe to cross-tab updates. */
    () => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored && isPackageManager(stored)) setValue(stored);
      window.addEventListener('storage', handleStorage);
      return (
        /** Release the listener when the Storybook example unmounts. */
        () => window.removeEventListener('storage', handleStorage)
      );
    },
  );

  return (
    <CodeBlock.AdapterProvider value={referenceShikiAdapter}>
      <Stack gap="8">
        <CodeTabs value={value} onChange={changeTab} />
        <CodeTabs value={value} onChange={changeTab} />
      </Stack>
    </CodeBlock.AdapterProvider>
  );
}
