# Show

Renders its content when a condition is true, and a fallback when it is false.

```tsx
import { Show } from '@leverui/components';
```

```tsx
<Show when={...} fallback={...}>
  <div>Content</div>
</Show>
```

## Props

| Prop       | Default | Type                                                                | Description                                                                     |
| ---------- | ------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `when`     | —       | `T \| null \| undefined`                                            | Render `children` when truthy.                                                  |
| `fallback` | —       | `JSX.Element`                                                       | Content to render when `when` is falsy.                                         |
| `children` | —       | `JSX.Element \| ((value: Accessor<NonNullable<T>>) => JSX.Element)` | Content, or a function given an accessor. Value is never `null` or `undefined`. |

`Show` adds no wrapper element, so it has no `as` or `asChild`. When the value
changes but stays truthy, the accessor returns the new value and the content is
not rebuilt. Use the right HTML elements in each branch.

No Lever UI styles and no style tag. Style the content yourself.
