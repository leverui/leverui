import { type JSX } from '@solidjs/web';
import { ChevronRightIcon, ExternalLinkIcon, FileIcon } from '@lucide/solid';
import { TreeView, createTreeCollection } from '../../src';
import './tree-view-examples.css';

interface LinkNode {
  id: string;
  name: string;
  href?: string;
  children?: LinkNode[];
}

const linkCollection = createTreeCollection<LinkNode>({
  nodeToValue:
    /** Keep links stable as folders expand. */
    (node) => node.id,
  nodeToString:
    /** Give both files and folders readable names. */
    (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'docs',
        name: 'Documentation',
        children: [
          { id: 'docs/getting-started', name: 'Getting started', href: '/docs/getting-started' },
          { id: 'docs/installation', name: 'Installation', href: '/docs/installation' },
          {
            id: 'docs/components',
            name: 'Components',
            children: [
              {
                id: 'docs/components/accordion',
                name: 'Accordion',
                href: '/docs/components/accordion',
              },
              { id: 'docs/components/dialog', name: 'Dialog', href: '/docs/components/dialog' },
              { id: 'docs/components/menu', name: 'Menu', href: '/docs/components/menu' },
            ],
          },
        ],
      },
      {
        id: 'examples',
        name: 'Examples',
        children: [
          { id: 'examples/react', name: 'React examples', href: '/examples/react' },
          { id: 'examples/vue', name: 'Vue examples', href: '/examples/vue' },
          { id: 'examples/solid', name: 'Solid examples', href: '/examples/solid' },
        ],
      },
      {
        id: 'external',
        name: 'External links',
        children: [
          {
            id: 'external/github',
            name: 'GitHub repository',
            href: 'https://github.com/leverui/leverui',
          },
          {
            id: 'external/npm',
            name: 'npm package',
            href: 'https://www.npmjs.com/package/@leverui/components',
          },
          { id: 'external/docs', name: 'Official docs', href: 'https://leverui.com/docs' },
        ],
      },
      { id: 'readme.md', name: 'README.md', href: '/readme' },
      { id: 'license', name: 'LICENSE', href: '/license' },
    ],
  },
});

/** Mix nested documentation folders with internal and outbound links. */
export function TreeViewLinks(): JSX.Element {
  return (
    <TreeView.Root collection={linkCollection} style={{ 'max-width': 'var(--lui-sizes-2xs)' }}>
      <TreeView.Tree>
        <TreeView.Node<LinkNode>
          render={
            /** Render a folder with a trailing chevron, or a file as a navigable anchor. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  <TreeView.BranchIndicator>
                    <ChevronRightIcon />
                  </TreeView.BranchIndicator>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item
                  asChild={
                    /** Apply the row behavior to the caller's anchor. */
                    (getProps) => (
                      <a {...getProps()} href={node.href}>
                        <FileIcon />
                        <TreeView.ItemText>{node.name}</TreeView.ItemText>
                        {node.href?.startsWith('http') && (
                          <ExternalLinkIcon class="example-tree-view-link-icon" />
                        )}
                      </a>
                    )
                  }
                />
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
