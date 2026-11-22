# Card

A container that groups related content and actions, such as a product or a
profile.

```tsx
import { Card } from '@leverui/components';
```

```tsx
<Card.Root>
  <Card.Header />
  <Card.Body />
  <Card.Footer />
</Card.Root>
```

## Customization

### Adding new variants

Give the card a class and style it. Load your CSS after the Lever UI
stylesheet.

```tsx
<Card.Root class="card-gradient">
  <Card.Body>Content</Card.Body>
</Card.Root>
```

```css
.card-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### Adding new sizes

Set `--leverui-card-padding` in your own class.

```css
.card-xl {
  --leverui-card-padding: var(--leverui-spacing-10);
}

.card-xl .leverui-card__title {
  font-size: var(--leverui-font-sizes-2xl);
}
```

### Changing defaults

`Card.PropsProvider` sets default props for the cards inside it. A prop on a
card wins.

```tsx
<Card.PropsProvider value={{ variant: 'elevated', size: 'lg' }}>
  <Card.Root>
    <Card.Body>Content</Card.Body>
  </Card.Root>
</Card.PropsProvider>
```

### Updating the theme

Set `--leverui-*` variables on `:root` for every card, or on a class for some.
See the [theme guide](../theme-guide.md).

## Props

### Root

| Prop       | Default   | Type                                  | Description                                    |
| ---------- | --------- | ------------------------------------- | ---------------------------------------------- |
| `size`     | `md`      | `'sm' \| 'md' \| 'lg'`                | Card size. Responsive.                         |
| `variant`  | `outline` | `'elevated' \| 'outline' \| 'subtle'` | Card style. Responsive.                        |
| `as`       | `div`     | Native HTML tag                       | HTML tag to render.                            |
| `asChild`  | —         | Solid render function                 | Render your own element with the card's props. |
| `unstyled` | `false`   | `boolean`                             | Turn off the Lever UI styles.                  |

`Card.Title` renders an `h3` and `Card.Description` a `p`. Pass `as` to change
the tag.

Classes: `.leverui-card__root`, `__header`, `__body`, `__footer`, `__title`,
`__description`.

## Explorer

Click a part name to highlight it in the preview.
