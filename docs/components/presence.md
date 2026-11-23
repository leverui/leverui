# Presence

Keeps content on the page until its closing animation ends.

```tsx
import { Presence } from '@leverui/components';
```

```tsx
<Presence present={true}>
  <div>Presence content</div>
</Presence>
```

Keeps an element in the page while its CSS entry and exit animations run.

- `present`: boolean. Whether the element is shown.
- `[data-state='open']`: styles the open state.
- `[data-state='closed']`: styles the closed state.

## Customize with CSS

Always has the `.lui-presence` class and sets `data-state` to `"open"` or
`"closed"`. Presence animates nothing by itself. Add your own class and
animation rules, and respect the reduced-motion setting.

```css
@keyframes details-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes details-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.details-presence[data-state='open'] {
  animation: details-in 200ms both;
}

.details-presence[data-state='closed'] {
  animation: details-out 200ms both;
}

@media (prefers-reduced-motion: reduce) {
  .details-presence {
    animation: none;
  }
}
```

The button that shows and hides the element sets its own expanded state.
Presence adds no dialog roles and does not manage focus. Use `class` and `style`
for one-off styling. No CSS objects or style shorthand props.
