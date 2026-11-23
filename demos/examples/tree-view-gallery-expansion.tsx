import { type JSX } from '@solidjs/web';
import { ChevronRightIcon, FileIcon, FolderIcon } from '@lucide/solid';
import {
  Button,
  ButtonGroup,
  HStack,
  TreeView,
  createTreeCollection,
  useTreeViewContext,
} from '../../src';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const collection = createTreeCollection<TreeNode>({
  nodeToValue:
    /** Give every tree item the stable machine value. */
    (node) => node.id,
  nodeToString:
    /** Give every tree item its visible accessible label. */
    (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'node_modules',
        name: 'node_modules',
        children: [
          { id: 'node_modules/solid-js', name: 'solid-js' },
          { id: 'node_modules/vite', name: 'vite' },
          {
            id: 'node_modules/@types',
            name: '@types',
            children: [
              { id: 'node_modules/@types/react', name: 'react' },
              { id: 'node_modules/@types/react-dom', name: 'react-dom' },
            ],
          },
        ],
      },
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'src/app.tsx', name: 'app.tsx' },
          { id: 'src/index.ts', name: 'index.ts' },
        ],
      },
      { id: 'vite.config', name: 'vite.config.ts' },
      { id: 'package.json', name: 'package.json' },
      { id: 'renovate.json', name: 'renovate.json' },
      { id: 'readme.md', name: 'README.md' },
    ],
  },
});

/** Toggle every branch through the public Tree View machine. */
function ExpandCollapseControls(): JSX.Element {
  const tree = useTreeViewContext();

  /** Keep the button state in sync with the current branch collection. */
  function allExpanded(): boolean {
    const branches = tree().collection.getBranchValues();
    return branches.every(
      /** A branch is expanded only when its value is in the machine state. */
      (branch) => tree().expandedValue.includes(branch),
    );
  }

  /** Expand every branch exposed by the collection. */
  function expandAll(): void {
    tree().expand();
  }

  /** Collapse every expanded branch. */
  function collapseAll(): void {
    tree().collapse();
  }

  return (
    <ButtonGroup size="2xs" variant="outline">
      <Button aria-label="Expand all" onClick={expandAll} hidden={allExpanded()}>
        Expand all
      </Button>
      <Button aria-label="Collapse all" onClick={collapseAll} hidden={!allExpanded()}>
        Collapse all
      </Button>
    </ButtonGroup>
  );
}

/** Show a single control for expanding or collapsing all folders. */
export function TreeViewExpandCollapseAll(): JSX.Element {
  return (
    <TreeView.Root collection={collection} style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
      <HStack justify="space-between">
        <TreeView.Label>Project files</TreeView.Label>
        <ExpandCollapseControls />
      </HStack>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a folder control or a file row. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}

/** Reserve expansion for the chevron trigger inside each folder. */
export function TreeViewExplicitExpand(): JSX.Element {
  return (
    <TreeView.Root
      collection={collection}
      style={{ 'max-width': 'var(--lui-sizes-sm)' }}
      expandOnClick={false}
    >
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a dedicated branch trigger before the folder icon. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchTrigger>
                    <TreeView.BranchIndicator>
                      <ChevronRightIcon />
                    </TreeView.BranchIndicator>
                  </TreeView.BranchTrigger>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
