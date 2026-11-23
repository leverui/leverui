# Table

Shows data in rows and columns.

```tsx
import { Table } from '@leverui/components';
```

```tsx
<Table.Root>
  <Table.Caption />
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader />
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell />
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell />
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

## Props

### Root

| Prop               | Default | Type                                                                                                     | Description                                                             |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `colorPalette`     | `gray`  | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                                          |
| `variant`          | `line`  | `'line' \| 'outline'`                                                                                    | Table style.                                                            |
| `size`             | `md`    | `'sm' \| 'md' \| 'lg'`                                                                                   | Table size. Responsive.                                                 |
| `native`           | —       | `boolean`                                                                                                | Style plain HTML table elements inside the root, such as `tr` and `td`. |
| `as`               | `table` | Native HTML tag                                                                                          | HTML tag to render.                                                     |
| `asChild`          | —       | Solid render function                                                                                    | Render your own element with the table's props.                         |
| `unstyled`         | `false` | `boolean`                                                                                                | Turn off the Lever UI styles. Markup and classes stay.                  |
| `interactive`      | —       | `boolean`                                                                                                | Highlight a row on hover.                                               |
| `stickyHeader`     | —       | `boolean`                                                                                                | Keep the header in view while the table scrolls.                        |
| `striped`          | —       | `boolean`                                                                                                | Shade every other row.                                                  |
| `showColumnBorder` | —       | `boolean`                                                                                                | Add borders between columns.                                            |

`Table` renders plain HTML table elements. It adds no keyboard handling,
selection state, or ARIA roles. Use what HTML tables already have, such as
`scope` on column headers. The root and the parts pass native attributes,
events, refs, `class`, and `style` to their elements.

`Caption` sits below the table by default (`captionSide="bottom"`). In `native`
mode a plain `caption` element stays at the top. To move it down, use
`Table.Caption` or your own CSS.

Use `ColumnGroup` and `Column` for column widths, `Footer` for totals and
summaries, and `ScrollArea` when the table is wider than its container.

`Table.RootPropsProvider` sets reactive default props for the roots inside it.
If the defaults depend on a signal, pass a function that returns them. A prop
on a root wins.

With a headless data grid library, render the headers and rows from its Solid
adapter inside `Table.Root native`. The TanStack example uses
`@tanstack/solid-table`. Install that package yourself.

## Customize with CSS

Classes: `.leverui-table__root`, `__header`, `__body`, `__row`,
`__columnHeader`, `__cell`, `__footer`, `__caption`, `__columnGroup`,
`__column`, and `__scrollArea`. The root also has attributes for size, variant,
stripes, hover, sticky header, column borders, palette, native mode, and
`unstyled`. Override these, or the `--lui-*` tokens, in your own CSS. Add a
part's class to your own HTML element to give it that part's look.

```tsx
<Table.Root>
  <Table.Body>
    <Table.Row>
      <td class="leverui-table__cell custom-cell">Custom cell</td>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

```css
.custom-cell {
  text-align: end;
}
```

## Explorer

Click a part name to highlight it in the preview.
