# Link

A link to another page or place.

```tsx
import { Link } from '@leverui/components';
```

```tsx
<Link href="...">Click here</Link>
```

Renders an `<a>`. For a link to another site, set `target` and `rel`. Write
link text that makes sense on its own.

## Guides

### Routing Library

Pass the router's link to `asChild` and spread `getProps()` onto it to keep the
`Link` styles and attributes.

```tsx
import { Link } from '@leverui/components';
import { A } from '@solidjs/router';

function Demo() {
  return (
    <Link
      asChild={(getProps) => (
        <A {...getProps()} href="/about">
          Click here
        </A>
      )}
    />
  );
}
```

### Styling Active Links

Set `aria-current="page"` on the current page's link.

```tsx
<Link href="/home" aria-current="page" class="nav-link">
  Home
</Link>
```

```css
.nav-link[aria-current='page'] {
  color: var(--leverui-colors-blue-500);
  font-weight: bold;
}
```

Solid Router's `A` sets `aria-current="page"` on the link whose `href` matches
the current route, so a routed link only needs the class.

```tsx
import { Link } from '@leverui/components';
import { A } from '@solidjs/router';
import type { JSX } from '@solidjs/web';

function NavLink(props: { href: string; children: JSX.Element }) {
  return (
    <Link
      class="nav-link"
      asChild={(getProps) => (
        <A {...getProps()} href={props.href}>
          {props.children}
        </A>
      )}
    />
  );
}
```

## Props

| Prop           | Default | Type                                                                                                     | Description                                    |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `colorPalette` | `gray`  | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                 |
| `variant`      | `plain` | `'underline' \| 'plain'`                                                                                 | Link style.                                    |
| `as`           | `a`     | Native HTML tag                                                                                          | HTML tag to render.                            |
| `asChild`      | —       | Solid render function                                                                                    | Render your own element with the link's props. |
| `unstyled`     | —       | `boolean`                                                                                                | Turn off the Lever UI styles.                  |

`LinkPropsProvider` sets default props for the links inside it. The defaults
can be reactive. A prop on a link wins.

The provider's `children` can be a function. It runs once for each link with no
content of its own and returns that link's label. Each link keeps its own `ref`
and `asChild` function.

For a clickable card, use `LinkBox` and `LinkOverlay`. See
[Link Overlay](link-overlay.md).

## Customize with CSS

Import `@leverui/components/styles.css` once, before your own CSS. Classes:
`.leverui-link`, `.leverui-linkbox`, and `.leverui-linkbox__overlay`. Style one
link with `class` and `style`. CSS object props, general style props, and
custom recipes are not part of the public API.

Other links in a `LinkBox`, and abbreviations with a `title`, sit above the
overlay and stay clickable. Use one overlay per box.
