# Responsive styles

Adapt a component's styles to the viewport width. Props such as `size` take a
different value for each breakpoint, and your own CSS can use media queries at
the same widths.

Load the default stylesheet once, before your own CSS.

```tsx
import '@leverui/components/styles.css';
import './app.css';
import { Box, Button } from '@leverui/components';

<Box class="content-panel">Content</Box>
<Button size={{ base: 'sm', md: 'lg' }}>Save</Button>;
```

```css
.content-panel {
  padding: var(--lui-spacing-2);
}

@media (min-width: 768px) {
  .content-panel {
    padding: var(--lui-spacing-6);
  }
}
```

`base` applies until a later breakpoint sets another value. Button writes
`data-size` and breakpoint attributes in server HTML, so its size applies
before JavaScript runs.

| Breakpoint | Minimum width |
| ---------- | ------------: |
| `sm`       |         480px |
| `md`       |         768px |
| `lg`       |        1024px |
| `xl`       |        1280px |
| `2xl`      |        1536px |

Widths are in pixels, so the browser's font size setting does not move a
breakpoint. Button size arrays follow `base`, `sm`, `md`, `lg`, `xl`, `2xl`
order. Use `null` to leave a breakpoint unchanged.

```tsx
<Button size={['sm', null, 'lg']}>Save</Button>
```

For a responsive color or a custom look, use your own class and media queries.
CSS outside Lever UI's layers overrides its defaults without `!important`.
