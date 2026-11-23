# Text

A paragraph of text. It takes its font from the content around it, or from a
text style you pick.

```tsx
import { Text } from '@leverui/components';
```

```tsx
<Text>This is the text component</Text>
```

## Ref

```tsx
import { Text } from '@leverui/components';

export function Demo() {
  let ref: HTMLParagraphElement | undefined;

  return <Text ref={ref}>This is the text component</Text>;
}
```

## Guides

### Rendered element

Renders a `p` by default and takes its font styles from the content around it.
Pass `as` to change the tag, or `asChild` to render your own element, which
keeps its own meaning and attributes.

### Text styles

`textStyle` sets a font size and line height by name: `2xs`, `xs`, `sm`, `md`,
`lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`. The four largest also
tighten the letter spacing. `label` is `sm` with a medium font weight.

```tsx
<Text textStyle="sm">Supporting copy</Text>
<Text textStyle="2xl">Section total</Text>
```

`Span`, `Box`, `Center`, `Stack`, `HStack`, `VStack`, `Flex`, `Square`, and
`Circle` accept the same prop. Each name is a rule in the stylesheet's
`leverui.utilities` layer, so it overrides component styles. Any other name
throws an error. For other sizes, use `class` or `style`.

### Clipping

`truncate` cuts the text off after one line. `lineClamp` takes a positive number
of lines, or `"none"` to remove a clamp.

```tsx
<Text truncate>A long label</Text>
<Text lineClamp={3}>A longer description</Text>
```

If clipping could hide something important, show it somewhere else too. To
change the type or the clipping by screen size, use CSS media queries.

### Shared defaults

`TextPropsProvider` sets default props for every `Text` inside it. A prop on a
`Text` wins.

```tsx
import { Text, TextPropsProvider } from '@leverui/components';

<TextPropsProvider value={{ truncate: true }}>
  <Text>Clipped by the provider</Text>
  <Text truncate={false}>This one wraps</Text>
</TextPropsProvider>;
```

## Customize with CSS

Class: `.lui-text`.

```tsx
<Text class="supporting-copy">Supporting copy</Text>
```

```css
.supporting-copy {
  color: var(--lui-colors-fg-muted);
  font-size: var(--lui-font-sizes-sm);
}
```

Not supported: text styles or clipping that change by breakpoint, custom
recipes, CSS objects, general style props. See the
[CSS theme guide](../theme-guide.md) for the supported overrides.
