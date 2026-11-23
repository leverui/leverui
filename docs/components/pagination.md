# Pagination

Buttons for moving between the pages of a long list or table.

```tsx
import { Pagination } from '@leverui/components';
```

```tsx
<Pagination.Root>
  <Pagination.PrevTrigger />
  <Pagination.Ellipsis />
  <Pagination.Item />
  <Pagination.PageText />
  <Pagination.NextTrigger />
</Pagination.Root>
```

## Shortcuts

### PaginationItems

Renders the page numbers. The page count comes from `count` and `pageSize`.

```tsx
<Pagination.Items />
```

Same as:

```tsx
<Pagination.Context>
  {(pagination) => (
    <For each={pagination().pages}>
      {(page, index) =>
        page.type === 'page' ? (
          <Pagination.Item {...page} />
        ) : (
          <Pagination.Ellipsis index={index()} />
        )
      }
    </For>
  )}
</Pagination.Context>
```

## Props

### Root

| Prop               | Default    | Type                                       | Description                                               |
| ------------------ | ---------- | ------------------------------------------ | --------------------------------------------------------- |
| `boundaryCount`    | `1`        | `number`                                   | Pages shown at the start and at the end.                  |
| `defaultPage`      | `1`        | `number`                                   | Starting page, when uncontrolled.                         |
| `defaultPageSize`  | `10`       | `number`                                   | Starting items per page, when uncontrolled.               |
| `siblingCount`     | `1`        | `number`                                   | Pages shown on each side of the active page.              |
| `type`             | `'button'` | `'button' \| 'link'`                       | Render the triggers as buttons or links.                  |
| `asChild`          | —          | Solid render function                      | Render your own element with the root's props.            |
| `count`            | —          | `number`                                   | Total number of items.                                    |
| `getPageUrl`       | —          | `(details: PageUrlDetails) => string`      | Returns each link's `href`. Only when `type` is `"link"`. |
| `ids`              | —          | Element ID map                             | Ids of the pagination elements.                           |
| `onPageChange`     | —          | `(details: PageChangeDetails) => void`     | Called when the page number changes.                      |
| `onPageSizeChange` | —          | `(details: PageSizeChangeDetails) => void` | Called when the page size changes.                        |
| `page`             | —          | `number`                                   | Active page, when you control it.                         |
| `pageSize`         | —          | `number`                                   | Items per page, when you control it.                      |
| `translations`     | —          | `IntlTranslations`                         | Translated text for assistive technology.                 |
| `unstyled`         | —          | `boolean`                                  | Turn off the default styles.                              |

Pagination does not change your data. Show the current page's items yourself.

`PageText` format: `compact` by default, or `short`, `long`, or a function
that returns the text.

With more than one pagination on a page, give each its own accessible label.

## Customize with CSS

Import `@leverui/components/styles.css` once for the default page text weight
and ellipsis look.

Classes: `.lui-pagination__root`, `.lui-pagination__item`,
`.lui-pagination__ellipsis`, `.lui-pagination__prevTrigger`,
`.lui-pagination__nextTrigger`, and `.lui-pagination__page-text` for
the page text.

Each part keeps its own attribute (such as `data-pagination-item`),
`aria-current`, and the disabled and link attributes up to date. Style with
these, `class`, and `style`.

Set `unstyled` on the root or on a part to turn off its default styles.
