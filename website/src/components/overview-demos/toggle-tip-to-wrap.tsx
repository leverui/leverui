import {
  Box,
  HStack,
  IconButton,
  Stack,
  Text,
  TreeView,
  Wrap,
  createTreeCollection,
} from '../../../../src';
import { type Component, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HelperIcon, PopupSurface } from './shared';

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

/** The small file tree in the tree view demo. */
const files = createTreeCollection<FileNode>({
  /** Use the node's id as its value. */
  nodeToValue: (node) => node.id,
  /** Use the node's name as its label. */
  nodeToString: (node) => node.name,
  rootNode: {
    id: 'root',
    name: '',
    children: [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app', name: 'app.tsx' },
          { id: 'index', name: 'index.ts' },
        ],
      },
      { id: 'package', name: 'package.json' },
    ],
  },
});

/** A picture of an open toggle tip under its info button. */
function ToggleTipDemo(): JSX.Element {
  return (
    <Stack gap="1" align="center">
      <HStack gap="1">
        <Text textStyle="sm">File size: 1.5 MB</Text>
        <IconButton size="2xs" variant="ghost" aria-label="About file size">
          <i class="bi bi-info-circle" aria-hidden="true" />
        </IconButton>
      </HStack>
      <PopupSurface>
        <Text textStyle="xs">The size before compression.</Text>
      </PopupSurface>
    </Stack>
  );
}

/** A picture of a tooltip: a small dark label under an icon button. */
function TooltipDemo(): JSX.Element {
  return (
    <Stack gap="1" align="center">
      <IconButton size="sm" variant="outline" aria-label="Download">
        <i class="bi bi-download" aria-hidden="true" />
      </IconButton>
      <Box
        textStyle="xs"
        style={{
          padding: 'var(--leverui-spacing-1) var(--leverui-spacing-2\\.5)',
          'border-radius': 'var(--leverui-radii-l2)',
          background: 'var(--leverui-colors-bg-inverted)',
          color: 'var(--leverui-colors-fg-inverted)',
        }}
      >
        Download file
      </Box>
    </Stack>
  );
}

/** An open folder with two files, and one file beside it. */
function TreeViewDemo(): JSX.Element {
  return (
    <TreeView.Root
      collection={files}
      size="xs"
      defaultExpandedValue={['src']}
      defaultSelectedValue={['app']}
      style={{ width: '100%' }}
    >
      <TreeView.Tree>
        <TreeView.Node<FileNode>
          /** Draw the guide line beside a folder's files. */
          indentGuide={() => <TreeView.BranchIndentGuide />}
          /** Draw a folder row or a file row. */
          render={({ node, nodeState }) =>
            nodeState().isBranch ? (
              <TreeView.BranchControl>
                <i class="bi bi-folder2-open" aria-hidden="true" />
                <TreeView.BranchText>{node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item>
                <i class="bi bi-file-earmark" aria-hidden="true" />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}

/** Visually hidden content does not show on screen. */
function VisuallyHiddenDemo(): JSX.Element {
  return <HelperIcon name="eye-slash" />;
}

/** Blocks of different widths that wrap onto three rows. */
function WrapDemo(): JSX.Element {
  return (
    <Wrap style={{ width: '100%' }}>
      <For each={['64px', '96px', '48px', '80px', '56px', '72px', '104px', '40px']}>
        {/** Draw one block of the given width. */}
        {(width) => (
          <Box
            style={{
              width,
              height: '24px',
              'border-radius': 'var(--leverui-radii-sm)',
              background: 'var(--overview-tint)',
            }}
          />
        )}
      </For>
    </Wrap>
  );
}

/** The overview demos for toggle-tip through wrap, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'toggle-tip': ToggleTipDemo,
  tooltip: TooltipDemo,
  'tree-view': TreeViewDemo,
  'visually-hidden': VisuallyHiddenDemo,
  wrap: WrapDemo,
};
