# List

A bulleted or numbered list.

```tsx
import { List } from '@leverui/components';
```

```tsx
<List.Root>
  <List.Item>Item 1</List.Item>
  <List.Item>Item 2</List.Item>
</List.Root>
```

`List.Root` renders a `ul` with `role="list"` and each `List.Item` an `li`.
Pass `as="ol"` for a numbered list.

## Props

| Prop       | Default  | Type                           | Description                                                        |
| ---------- | -------- | ------------------------------ | ------------------------------------------------------------------ |
| `variant`  | `marker` | `'marker' \| 'plain'`          | List style. `marker` shows bullets or numbers. `plain` hides them. |
| `as`       | `ul`     | Native HTML tag                | HTML tag to render.                                                |
| `asChild`  | —        | Solid render function          | Render your own element with the list's props.                     |
| `unstyled` | —        | `boolean`                      | Turn off the Lever UI styles.                                      |
| `align`    | —        | `'center' \| 'start' \| 'end'` | How item content lines up, such as an icon beside its text.        |

`variant` and `align` are responsive, such as
`align={{ base: 'start', md: 'end' }}`. Every part takes native HTML
attributes, a ref, `class`, `style`, and `unstyled`. An indicator's ref points
to the element you render with `asChild`. A nested `List.Root` does not take
its look from the outer list.

`List.RootPropsProvider` sets default props for the lists inside it. Pass a
value or a function that returns one. A prop on a list wins. If the function
reads a signal, the lists update in place.

## Customize with CSS

Import `@leverui/components/styles.css` once in your app. Set
`--leverui-list-gap` on a list or a wrapping class to change the space between
items and nested lists.

```css
.compact-list {
  --leverui-list-gap: var(--leverui-spacing-1);
}
```

Classes: `.leverui-list__root`, `.leverui-list__item`, and
`.leverui-list__indicator`. Put one on your own element inside a `List.Root`
and it picks up the list's variant. The root has `data-variant` and
`data-align`, plus one per screen size you set, such as `data-variant-md`.

Style the bullet or number with `::marker`. Lever UI's styles sit in a CSS
layer, so your unlayered CSS wins at equal specificity. No object CSS, general
style props, custom recipes, or style object hooks.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
