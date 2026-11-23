# Breadcrumb

A trail of links that shows where the current page sits in the site.

```tsx
import { Breadcrumb } from '@leverui/components';
```

```tsx
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link />
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
  </Breadcrumb.List>
</Breadcrumb.Root>
```

For one component that sets up the parts, see the
[snippet below](#closed-component).

## Routing Library

Pass a render function to `asChild` and spread `getProps()` onto the router's
link to keep the breadcrumb styles.

```tsx
import { A } from '@solidjs/router';
import { Breadcrumb } from '@leverui/components';

function Example() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link
            asChild={(getProps) => (
              <A {...getProps()} href="/docs">
                Docs
              </A>
            )}
          />
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
```

## Closed Component

One component that takes a list of items instead of parts.

```tsx
import { For, Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Breadcrumb, type BreadcrumbRootProps } from '@leverui/components';

export type ClosedBreadcrumbProps = BreadcrumbRootProps & {
  separator?: JSX.Element;
  separatorGap?: string | undefined;
  items: readonly { title: JSX.Element; url?: string }[];
};

export function ClosedBreadcrumb(props: ClosedBreadcrumbProps) {
  const root = omit(props, 'separator', 'separatorGap', 'items');

  return (
    <Breadcrumb.Root {...root}>
      <Breadcrumb.List style={{ gap: props.separatorGap }}>
        <For each={props.items}>
          {(item, index) => (
            <Show
              when={index() < props.items.length - 1}
              fallback={
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink>{item.title}</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
              }
            >
              <Breadcrumb.Item>
                <Breadcrumb.Link href={item.url}>{item.title}</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator>{props.separator}</Breadcrumb.Separator>
            </Show>
          )}
        </For>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
```

## Props

### Root

| Prop           | Default | Type                     | Description                                          |
| -------------- | ------- | ------------------------ | ---------------------------------------------------- |
| `colorPalette` | `gray`  | `string`                 | Color palette. Built-in or your own.                 |
| `variant`      | `plain` | `'underline' \| 'plain'` | Breadcrumb style. Responsive.                        |
| `size`         | `md`    | `'sm' \| 'md' \| 'lg'`   | Breadcrumb size. Responsive.                         |
| `as`           | `nav`   | Native HTML tag          | HTML tag to render.                                  |
| `asChild`      | —       | Solid render function    | Render your own element with the breadcrumb's props. |
| `unstyled`     | `false` | `boolean`                | Turn off the Lever UI styles.                        |

Use one `CurrentLink` for the current page. It adds `aria-current="page"`. If
the page has more than one navigation landmark, give the root its own label.
`Separator` is decorative, so keep it out of the link names.

## Customize with CSS

Classes: `.lui-breadcrumb__root`, `__list`, `__item`, `__link`,
`__currentLink`, `__separator`, `__ellipsis`. The root also sets `data-size`,
`data-variant`, and `data-lui-color-palette`.

```css
.site-trail .lui-breadcrumb__link {
  color: var(--lui-colors-blue-fg);
}
```

## Explorer

Click a part name to highlight it in the preview.
