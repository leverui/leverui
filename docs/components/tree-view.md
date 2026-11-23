# Tree View

A nested list that the user can expand and collapse, such as folders and files.

```tsx
import { TreeView } from '@leverui/components';
```

```tsx
<TreeView.Root>
  <TreeView.Label />
  <TreeView.Tree>
    <TreeView.Branch>
      <TreeView.BranchControl>
        <TreeView.BranchIndicator />
        <TreeView.BranchText />
      </TreeView.BranchControl>
      <TreeView.BranchContent>
        <TreeView.BranchIndentGuide />
        <TreeView.Item />
      </TreeView.BranchContent>
    </TreeView.Branch>
    <TreeView.Item />
  </TreeView.Tree>
</TreeView.Root>
```

> Pass your tree data to `createTreeCollection` from `@leverui/components`.

## Shortcuts

### `TreeView.Node`

Renders the whole tree. `nodeState` is an accessor. `indentGuide` is a
function, so each branch gets its own element.

```tsx
<TreeView.Node
  indentGuide={() => <TreeView.BranchIndentGuide />}
  render={({ node, nodeState }) =>
    nodeState().isBranch ? (
      <TreeView.BranchControl>
        <TreeView.BranchText>{node.name}</TreeView.BranchText>
      </TreeView.BranchControl>
    ) : (
      <TreeView.Item>
        <TreeView.ItemText>{node.name}</TreeView.ItemText>
      </TreeView.Item>
    )
  }
/>
```

Same as:

```tsx
function TreeNode(props: TreeView.NodeProviderProps<Node>) {
  return (
    <TreeView.NodeProvider node={props.node} indexPath={props.indexPath}>
      {props.node.children ? (
        <TreeView.Branch>
          <TreeView.BranchControl>
            <TreeView.BranchText>{props.node.name}</TreeView.BranchText>
          </TreeView.BranchControl>
          <TreeView.BranchContent>
            <TreeView.BranchIndentGuide />
            <For each={props.node.children}>
              {(child, index) => (
                <TreeNode node={child} indexPath={[...props.indexPath, index()]} />
              )}
            </For>
          </TreeView.BranchContent>
        </TreeView.Branch>
      ) : (
        <TreeView.Item>
          <TreeView.ItemText>{props.node.name}</TreeView.ItemText>
        </TreeView.Item>
      )}
    </TreeView.NodeProvider>
  );
}
```

## Guides

### Collections and state

Each node needs a value that stays the same. To control the state, use
`selectedValue` with `onSelectionChange`, and `expandedValue` with
`onExpandedChange`. Keep a visible label on the tree. Do not rely on color alone
to show that a node is disabled.

## Props

### Root

| Prop                     | Default  | Type                                                                                                     | Description                                                           |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `collection` (required)  | —        | `TreeCollection<T>`                                                                                      | Collection of tree nodes.                                             |
| `expandOnClick`          | `true`   | `boolean`                                                                                                | Open a branch on click.                                               |
| `selectionMode`          | `single` | `'multiple' \| 'single'`                                                                                 | Select one node or several.                                           |
| `typeahead`              | `true`   | `boolean`                                                                                                | Type to jump to a matching node.                                      |
| `colorPalette`           | `gray`   | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                                        |
| `size`                   | `md`     | `'md' \| 'sm' \| 'xs'`                                                                                   | Tree size.                                                            |
| `variant`                | `subtle` | `'subtle' \| 'solid'`                                                                                    | Tree style.                                                           |
| `as`                     | `div`    | Native tag                                                                                               | HTML tag to render.                                                   |
| `asChild`                | —        | Solid render function                                                                                    | Render your own element with the root's props.                        |
| `unstyled`               | —        | `boolean`                                                                                                | Turn off the Lever UI styles.                                         |
| `checkedValue`           | —        | `string[]`                                                                                               | Checked nodes, when you control them.                                 |
| `defaultCheckedValue`    | —        | `string[]`                                                                                               | Nodes checked on first render.                                        |
| `defaultExpandedValue`   | —        | `string[]`                                                                                               | Ids of the nodes expanded on first render.                            |
| `defaultFocusedValue`    | —        | `string`                                                                                                 | Node focused on first render.                                         |
| `defaultSelectedValue`   | —        | `string[]`                                                                                               | Nodes selected on first render.                                       |
| `expandedValue`          | —        | `string[]`                                                                                               | Ids of the expanded nodes, when you control them.                     |
| `focusedValue`           | —        | `string`                                                                                                 | Value of the focused node.                                            |
| `ids`                    | —        | `Partial<{ root: string; tree: string; label: string; node: (value: string) => string }>`                | Ids of the tree elements.                                             |
| `lazyMount`              | `false`  | `boolean`                                                                                                | Render a branch's content on first open.                              |
| `loadChildren`           | —        | `(details: LoadChildrenDetails<T>) => Promise<T[]>`                                                      | Load a node's children. The branch expands once the promise resolves. |
| `onCheckedChange`        | —        | `(details: CheckedChangeDetails) => void`                                                                | Called when the checked nodes change.                                 |
| `onExpandedChange`       | —        | `(details: ExpandedChangeDetails<T>) => void`                                                            | Called when a branch opens or closes.                                 |
| `onFocusChange`          | —        | `(details: FocusChangeDetails<T>) => void`                                                               | Called when the focused node changes.                                 |
| `onLoadChildrenComplete` | —        | `(details: LoadChildrenCompleteDetails<T>) => void`                                                      | Called when a node finishes loading its children.                     |
| `onLoadChildrenError`    | —        | `(details: LoadChildrenErrorDetails<T>) => void`                                                         | Called when loading children fails.                                   |
| `onSelectionChange`      | —        | `(details: SelectionChangeDetails<T>) => void`                                                           | Called when the selection changes.                                    |
| `scrollToIndexFn`        | —        | `(details: ScrollToIndexDetails<T>) => void`                                                             | Scroll to an index. For virtualized trees.                            |
| `selectedValue`          | —        | `string[]`                                                                                               | Selected nodes, when you control them.                                |
| `translations`           | —        | `IntlTranslations`                                                                                       | Localized labels for screen readers.                                  |
| `unmountOnExit`          | `false`  | `boolean`                                                                                                | Remove a branch's content when it closes.                             |
| `animateContent`         | —        | `boolean`                                                                                                | Animate branch content on expand and collapse.                        |

### Node

| Prop                 | Default | Type                                      | Description                                                                                                                                              |
| -------------------- | ------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `render` (required)  | —       | `(props: NodeRenderProps) => JSX.Element` | Render a branch control or a leaf item. Gets `node`, `indexPath`, and the `nodeState` accessor. Runs once per row, so call `nodeState()` inside the JSX. |
| `indentGuide`        | —       | `() => JSX.Element`                       | Render the indent guide inside each branch's content.                                                                                                    |
| `renderBranch`       | —       | `(props: NodeRenderProps) => JSX.Element` | Render branch controls apart from `render`. Runs once per row.                                                                                           |
| `branchProps`        | —       | `TreeViewBranchProps`                     | Props for each `TreeView.Branch`.                                                                                                                        |
| `branchContentProps` | —       | `TreeViewBranchContentProps`              | Props for each `TreeView.BranchContent`.                                                                                                                 |

## Customize with CSS

`size`, `variant`, and `animateContent` take a value per screen size. Pass an
object with the keys `base`, `sm`, `md`, `lg`, `xl`, and `2xl`. The root and
every part accept `class` and `style`. Set `unstyled` on the root or on one
part to turn off its default styles.

Each part has a fixed class, such as `.leverui-tree-view__item` or
`.leverui-tree-view__branchControl`.

```css
.project-tree {
  --lui-tree-indent-size: 1.5rem;
  --lui-tree-indentation: 2rem;
  --lui-tree-icon-size: 1rem;
  --lui-tree-padding-inline: 0.75rem;
  --lui-tree-padding-block: 0.4rem;
  --lui-tree-item-gap: 0.5rem;
}

.project-tree .leverui-tree-view__item[data-selected] {
  font-weight: 600;
}
```

Add `class="project-tree"` to `TreeView.Root`. Load your CSS after the default
stylesheet.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
