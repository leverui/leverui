import { TreeView, createTreeCollection, type TreeViewNodeProps } from '@leverui/components';

interface Entry {
  id: string;
  name: string;
  children?: Entry[];
}

const collection = createTreeCollection<Entry>({
  nodeToValue:
    /** Keep the installed collection's values stable. */
    (node) => node.id,
  nodeToString:
    /** Keep accessible names available to the machine. */
    (node) => node.name,
  rootNode: { id: 'root', name: 'Tree', children: [{ id: 'leaf', name: 'Leaf' }] },
});

export const tree = (
  <TreeView.Root
    collection={collection}
    onSelectionChange={
      /** Confirm callback details infer the installed node type. */
      (details) => {
        const selected: Entry | undefined = details.selectedNodes[0];
        return selected?.id;
      }
    }
  >
    <TreeView.Tree>
      <TreeView.Node<Entry>
        render={
          /** Confirm Node exposes a reactive Solid state accessor. */
          ({ node, nodeState }) => (
            <TreeView.Item data-selected={nodeState().selected}>
              <TreeView.ItemText>{node.name}</TreeView.ItemText>
            </TreeView.Item>
          )
        }
      />
    </TreeView.Tree>
  </TreeView.Root>
);

export type DefaultNodeProps = TreeViewNodeProps;

export const nativeTreeStyling = (
  <TreeView.Root
    collection={collection}
    size={{ base: 'xs', md: 'sm' }}
    variant="solid"
    animateContent={{ base: false, md: true }}
    colorPalette="teal"
    class="consumer-tree"
    style={{ 'max-width': '24rem' }}
  >
    <TreeView.Tree>
      <TreeView.Item class="consumer-leaf" style={{ color: 'rebeccapurple' }} />
    </TreeView.Tree>
  </TreeView.Root>
);

export const invalidTreeStyling = (
  <>
    {/* @ts-expect-error Tree View has no CSS object prop. */}
    <TreeView.Root collection={collection} css={{ padding: 2 }} />
    {/* @ts-expect-error Tree View has no custom recipe prop. */}
    <TreeView.Root collection={collection} recipe={{}} />
    {/* @ts-expect-error Tree View parts reject arbitrary style shortcuts. */}
    <TreeView.Item maxW="sm" />
  </>
);
