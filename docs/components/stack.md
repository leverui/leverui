# Stack

Places its children in a column or a row with even space between them.

```tsx
import { HStack, Stack, VStack } from '@leverui/components';
```

```tsx
<Stack>
  <div />
  <div />
</Stack>
```

## Props

| Prop             | Default  | Type                         | Description                                      |
| ---------------- | -------- | ---------------------------- | ------------------------------------------------ |
| `direction`      | `column` | `row`, `column`, or reversed | Which way the children flow.                     |
| `gap`            | `2`      | Spacing token or CSS length  | Space between children. `2` is `8px`.            |
| `align`          | —        | CSS `align-items` value      | Alignment across the direction.                  |
| `justify`        | —        | CSS `justify-content` value  | Alignment along the direction.                   |
| `wrap`           | —        | CSS `flex-wrap` value        | Whether children wrap onto new lines.            |
| `separator`      | —        | function                     | Renders a divider between each pair of children. |
| `renderChildren` | —        | function                     | Returns the children, for lists that change.     |
| `as`             | `div`    | Native HTML tag              | HTML tag to render.                              |
| `asChild`        | —        | Solid render callback        | Render your own element in place of the default. |
| `unstyled`       | `false`  | `boolean`                    | Turns off the default layout rules.              |

Responsive: `direction`, `gap`, `align`, `justify`, and `wrap`.

`HStack` is a row with its items centered vertically. `VStack` is a column with
its items centered horizontally. Both take the same props and ignore
`direction`.

### Separator function

`separator` receives `{ class }` and returns the divider. Put that class on the
element you return. `StackSeparator` is the ready-made divider.

```tsx
<Stack separator={(props) => <StackSeparator {...props} />}>
  <div />
  <div />
</Stack>
```

`StackSeparator` is an empty `div`, so screen readers skip it.

### Dynamic lists

When a signal adds or removes children, pass them through `renderChildren`
so the dividers follow.

```tsx
<Stack
  separator={(props) => <StackSeparator {...props} />}
  renderChildren={() => <For each={items()}>{(item) => <Row item={item} />}</For>}
/>
```

## Customize with CSS

Classes: `.lui-stack` on the root, `.lui-stack-separator` on the
separator. Style them in CSS loaded after the Lever UI stylesheet, or add your
own class or `style`. `unstyled` turns off the default layout rules but keeps
the root class and the HTML semantics.

```css
.article-actions .lui-stack-separator {
  border-color: currentColor;
}
```
