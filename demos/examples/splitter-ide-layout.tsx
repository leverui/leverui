import { createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CodeBlock, Splitter, Stack, Theme, createShikiAdapter } from '../../src';
import {
  defaultEditorFile,
  fileContents,
  fileTree,
  terminalOutput,
  type EditorFile,
} from './splitter-ide-data';
import { FileTree } from './splitter-ide-tree';
import './splitter-ide-layout.css';

const shikiAdapter = createShikiAdapter({
  /** Load syntax highlighting only when the IDE example is displayed. */
  async load() {
    const { createHighlighter } = await import('shiki');
    return createHighlighter({
      langs: ['tsx', 'ts', 'js', 'json', 'bash'],
      themes: ['github-dark'],
    });
  },
  theme: 'github-dark',
});

/** Show the selected file's highlighted source in the editor panel. */
function Editor(props: { file: EditorFile; fileName: string }): JSX.Element {
  return (
    <CodeBlock.Root
      code={props.file.code}
      language={props.file.language}
      class="splitter-ide-code"
      size="sm"
    >
      <CodeBlock.Header>
        <CodeBlock.Title>{props.fileName}</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code>
          <CodeBlock.CodeText />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/** Show the example's terminal transcript below the editor. */
function Terminal(): JSX.Element {
  return (
    <CodeBlock.Root code={terminalOutput} language="bash" class="splitter-ide-code" size="sm">
      <CodeBlock.Header>
        <CodeBlock.Title>Terminal</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code>
          <CodeBlock.CodeText />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/** Reproduce the nested file explorer, editor, and terminal layout. */
export function SplitterIdeLayout(): JSX.Element {
  const [activeFileId, setActiveFileId] = createSignal('app');
  const activeFile = createMemo(
    /** Resolve the selected file's code and language. */
    () => fileContents[activeFileId()] ?? defaultEditorFile,
  );
  const fileName = createMemo(
    /** Resolve the selected file's visible tree label. */
    () =>
      fileTree
        .flatMap(
          /** Visit files inside the one-level tree. */
          (node) => (node.type === 'folder' ? (node.children ?? []) : [node]),
        )
        .find(
          /** Match the selected file's stable ID. */
          (node) => node.id === activeFileId(),
        )?.name ?? 'App.tsx',
  );

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <Theme appearance="dark" colorPalette="gray">
        <Splitter.Root
          defaultSize={[20, 80]}
          panels={[
            { id: 'explorer', collapsible: true, collapsedSize: 0, minSize: 10 },
            { id: 'editor-terminal', minSize: 50 },
          ]}
          class="splitter-example-border splitter-example-min-600"
        >
          <Splitter.Panel id="explorer" class="splitter-example-panel">
            <Stack
              gap="1"
              style={{
                padding: 'var(--leverui-spacing-2)',
                height: '100%',
                width: '100%',
                'overflow-y': 'auto',
                'overflow-x': 'hidden',
              }}
            >
              <FileTree
                nodes={fileTree}
                activeFileId={activeFileId()}
                onFileClick={setActiveFileId}
              />
            </Stack>
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="explorer:editor-terminal" />
          <Splitter.Panel id="editor-terminal">
            <Splitter.Root
              defaultSize={[70, 30]}
              panels={[
                { id: 'editor', minSize: 30 },
                { id: 'terminal', collapsible: true, collapsedSize: 5, minSize: 15 },
              ]}
              orientation="vertical"
              class="splitter-example-fill"
            >
              <Splitter.Panel id="editor">
                <Editor file={activeFile()} fileName={fileName()} />
              </Splitter.Panel>
              <Splitter.ResizeTrigger id="editor:terminal" />
              <Splitter.Panel id="terminal">
                <Terminal />
              </Splitter.Panel>
            </Splitter.Root>
          </Splitter.Panel>
        </Splitter.Root>
      </Theme>
    </CodeBlock.AdapterProvider>
  );
}
