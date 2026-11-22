import { type JSX } from '@solidjs/web';
import { FrameIcon, ImageIcon, TypeIcon } from '@lucide/solid';
import { Dynamic } from '@solidjs/web';
import { TreeView, createTreeCollection } from '../../src';

interface DesignNode {
  id: string;
  name: string;
  type: 'frame' | 'image' | 'text';
  children?: DesignNode[];
}

const designCollection = createTreeCollection<DesignNode>({
  nodeToValue:
    /** Keep every design layer attached to its stable key. */
    (node) => node.id,
  nodeToString:
    /** Expose the visible layer name to the tree machine. */
    (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    type: 'frame',
    children: [
      {
        id: 'page',
        name: 'Page',
        type: 'frame',
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'frame',
            children: [
              { id: 'logo', name: 'Logo', type: 'image' },
              { id: 'nav', name: 'Navigation', type: 'text' },
            ],
          },
        ],
      },
      { id: 'footer', name: 'Footer', type: 'text' },
      {
        id: 'main',
        name: 'Main',
        type: 'frame',
        children: [
          { id: 'hero', name: 'Hero section', type: 'text' },
          { id: 'features', name: 'Features', type: 'text' },
        ],
      },
    ],
  },
});

const layerIcons = {
  frame: FrameIcon,
  image: ImageIcon,
  text: TypeIcon,
} as const;

/** Show design layers with frame, image, and text icons. */
export function TreeViewCustomIcon(): JSX.Element {
  return (
    <TreeView.Root
      collection={designCollection}
      style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
      size="sm"
      defaultExpandedValue={['ROOT']}
    >
      <TreeView.Label class="leverui-visually-hidden">Tree</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<DesignNode>
          render={
            /** Render a design layer with its type icon. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <Dynamic component={layerIcons[node.type]} />
                  <TreeView.BranchText
                    style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}
                  >
                    {node.name}
                  </TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <Dynamic component={layerIcons[node.type]} />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
