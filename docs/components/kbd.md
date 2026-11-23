# Kbd

Shows a keyboard key or shortcut, such as `Ctrl` `C`.

```tsx
import { Kbd } from '@leverui/components';
```

```tsx
<Kbd>F12</Kbd>
```

## Guides

### Semantics

Renders a `<kbd>` element. Adds no role and no keyboard behavior. Defaults:
`size="md"` and `variant="raised"`. `size` and `variant` are responsive.

```tsx
<Kbd size={{ base: 'sm', md: 'lg' }} variant="outline" colorPalette="blue">
  ⌘
</Kbd>
```

### Provider defaults

`KbdPropsProvider` sets default props for the keys inside it. Defaults are
reactive. A prop on a `Kbd` wins. Defaults can include HTML attributes, styles,
an `as` tag, and a `children` function, but not `ref` or `asChild`.

```tsx
import { Kbd, KbdPropsProvider } from '@leverui/components';

<KbdPropsProvider value={{ size: 'sm', variant: 'outline' }}>
  <Kbd>Esc</Kbd>
  <Kbd size="lg">Enter</Kbd>
</KbdPropsProvider>;
```

Pass `children` as a function that returns new JSX. It runs for every `Kbd`.
JSX shared directly would move one DOM node from one `Kbd` to the next.

```tsx
function renderSharedKey() {
  return <span>Esc</span>;
}

<KbdPropsProvider value={{ children: renderSharedKey }}>
  <Kbd />
  <Kbd />
</KbdPropsProvider>;
```

## Props

| Prop           | Default  | Type                                                             | Description                                   |
| -------------- | -------- | ---------------------------------------------------------------- | --------------------------------------------- |
| `colorPalette` | `gray`   | `string`                                                         | Color palette, built-in or your own.          |
| `variant`      | `raised` | `'raised' \| 'outline' \| 'subtle' \| 'plain'` or responsive map | Key style.                                    |
| `size`         | `md`     | `'sm' \| 'md' \| 'lg'` or responsive map                         | Key size.                                     |
| `as`           | `kbd`    | Native HTML tag                                                  | HTML tag to render.                           |
| `asChild`      | —        | Solid render function                                            | Render your own element with the key's props. |
| `unstyled`     | `false`  | `boolean`                                                        | Turn off the Lever UI styles.                 |

Also accepts the standard HTML attributes, including `class` and `style`.

## Customize with CSS

Style `.lui-kbd`, or select its `data-size` and `data-variant` attributes.
Import `@leverui/components/styles.css` once and load your stylesheet after it.

No general style props, CSS objects, or custom recipes. Use
[CSS theming](../theme-guide.md).
