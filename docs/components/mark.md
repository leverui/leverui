# Mark

Highlights a word or phrase in a sentence, like a marker pen.

```tsx
import { Mark } from '@leverui/components';
```

```tsx
<Text>
  Orders placed <Mark>before 2 pm</Mark> ship the same day
</Text>
```

## Props

| Prop           | Default | Type                                                                                                     | Description                                    |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `colorPalette` | `gray`  | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                 |
| `as`           | `mark`  | Native tag                                                                                               | HTML tag to render.                            |
| `asChild`      | —       | Solid render function                                                                                    | Render your own element with the mark's props. |
| `variant`      | —       | `'subtle' \| 'solid' \| 'text' \| 'plain'`                                                               | Mark style.                                    |

`variant` is responsive, for example
`variant={{ base: 'subtle', md: 'solid' }}`.

`MarkPropsProvider` sets the default variant, palette, class, and native
attributes for the marks inside it. `Highlight` matches get them too.

```tsx
import { Highlight, MarkPropsProvider } from '@leverui/components';

<MarkPropsProvider value={{ variant: 'solid', colorPalette: 'blue' }}>
  <Highlight query="important">This is important text.</Highlight>
</MarkPropsProvider>;
```

A provider can set a default `as` tag. A single Mark can override it. Set
`asChild` and `ref` on the Mark itself, not on the provider.

A Mark rendered as a link keeps a link's focus and keyboard behavior.

## Customize with CSS

Every Mark has the class `.leverui-mark` and `data-variant` attributes. These
names are stable.

```css
.article-emphasis {
  white-space: normal;
  --leverui-colors-color-palette-subtle: #dceaff;
}
```

Pass `class="article-emphasis"` to style one Mark. To style every Mark in a
section, set the palette variable on an element that contains them.

A variant set for a screen size adds a matching attribute, from
`data-variant-sm` to `data-variant-2xl`.
