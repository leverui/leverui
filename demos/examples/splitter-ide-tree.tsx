import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { Dynamic } from '@solidjs/web';
import { HStack, Span, Stack } from '../../src';
import type { FileNode } from './splitter-ide-data';

export interface FileTreeProps {
  nodes: FileNode[];
  activeFileId: string;
  onFileClick: (id: string) => void;
}

/** Show a file or folder icon beside a tree entry. */
function TreeIcon(props: { type: FileNode['type'] }): JSX.Element {
  return (
    <Dynamic
      component={props.type === 'folder' ? FolderIcon : FileIcon}
      style={{ 'flex-shrink': 0 }}
    />
  );
}

/** Render one file entry and notify the editor when it is chosen. */
function FileEntry(props: { node: FileNode; level: number } & FileTreeProps): JSX.Element {
  /** Select the file represented by this tree entry. */
  function selectFile(): void {
    if (props.node.id) props.onFileClick(props.node.id);
  }

  return (
    <HStack
      as="button"
      type="button"

      gap="2"

      data-current={props.node.id === props.activeFileId || undefined}
      class="file-tree-entry"
      onClick={selectFile}
      textStyle="sm"
      style={{
        width: '100%',
        'padding-inline-start': `var(--lui-spacing-${props.level * 4 + 2})`,
        'padding-inline-end': 'var(--lui-spacing-2)',
        'padding-block': 'var(--lui-spacing-1)',
        'border-radius': 'var(--lui-radii-l2)',
        cursor: 'pointer',
        'flex-shrink': '0',
      }}
    >
      <TreeIcon type="file" />
      <Span style={{ overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}>
        {props.node.name}
      </Span>
    </HStack>
  );
}

/** Render a nested folder or file while preserving the tree spacing. */
function TreeNode(props: { node: FileNode; level: number } & FileTreeProps): JSX.Element {
  return (
    <Show when={props.node.type === 'folder'} fallback={<FileEntry {...props} />}>
      <Stack
        gap="0.5"
        style={{
          width: '100%',
          'padding-inline-start': props.level > 0 ? 'var(--lui-spacing-4)' : '0',
        }}
      >
        <HStack
          gap="2"
          textStyle="sm"
          style={{
            'padding-inline': 'var(--lui-spacing-2)',
            'padding-block': 'var(--lui-spacing-1)',
            'flex-shrink': '0',
          }}
        >
          <TreeIcon type="folder" />
          <Span
            style={{ overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}
          >
            {props.node.name}
          </Span>
        </HStack>
        <Show when={props.node.children}>
          {
            /** Render the folder's nested entries at the next indentation level. */
            (children) => (
              <Stack gap="0.5">
                <For each={children()}>
                  {
                    /** Render one nested folder or file. */
                    (node) => <TreeNode {...props} node={node} level={props.level + 1} />
                  }
                </For>
              </Stack>
            )
          }
        </Show>
      </Stack>
    </Show>
  );
}

/** Show the IDE's interactive file tree. */
export function FileTree(props: FileTreeProps): JSX.Element {
  return (
    <>
      <style>{`.file-tree-entry[data-current] {
        background: var(--lui-colors-bg-emphasized);
        color: var(--lui-colors-yellow-solid);
      }`}</style>
      <Stack gap="0.5" style={{ width: '100%' }}>
        <For each={props.nodes}>
          {
            /** Render one entry at the root of the file tree. */
            (node) => <TreeNode {...props} node={node} level={0} />
          }
        </For>
      </Stack>
    </>
  );
}
