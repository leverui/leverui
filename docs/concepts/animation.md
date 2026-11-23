# Animation

Lever UI animates with plain CSS. Anything that opens and closes has
`data-state="open"` or `data-state="closed"`. Give each state an `animation`.

```css
.details-panel[data-state='open'] {
  animation: fade-in var(--lui-durations-slow);
}

.details-panel[data-state='closed'] {
  animation: fade-out var(--lui-durations-moderate);
}
```

`Dialog`, `Drawer`, `Menu`, `Popover`, and `Tooltip` already animate. Use this
for your own content, or to change theirs.

## Your own content

Wrap it in [`Presence`](../components/presence.md). `Presence` sets
`data-state` and keeps the element on the page until its closing animation
ends. It animates nothing by itself; the CSS above does.

```tsx
import { Button, Presence } from '@leverui/components';
import { createSignal } from 'solid-js';
import type { JSX } from '@solidjs/web';

/** Keep the details mounted until their closing animation ends. */
export function AnimatedDetails(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Flip the controlled presence state. */
  function toggle(): void {
    setOpen((current) => !current);
  }

  return (
    <>
      <Button aria-expanded={open()} onClick={toggle}>
        Toggle details
      </Button>
      <Presence class="details-panel" present={open()} unmountOnExit>
        Details
      </Presence>
    </>
  );
}
```

## Enter animation

An open element has `data-state="open"`.

```css
.details-panel[data-state='open'] {
  animation: details-in var(--lui-durations-slow) var(--lui-easings-ease-out);
}
```

Use a built-in keyframe, or write your own under a new name. Reusing a built-in
name such as `fade-in` replaces it for every component.

```css
@keyframes details-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## Exit animation

A closed element has `data-state="closed"`.

```css
.details-panel[data-state='closed'] {
  animation: details-out var(--lui-durations-moderate) var(--lui-easings-ease-in);
}
```

```css
@keyframes details-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

## Composing animations

List several keyframes in `animation-name` to run them together.

```css
.details-panel[data-state='open'] {
  animation-name: fade-in, scale-in;
  animation-duration: var(--lui-durations-slow);
}

.details-panel[data-state='closed'] {
  animation-name: fade-out, scale-out;
  animation-duration: var(--lui-durations-faster);
}
```

## Built-in keyframes

| Keyframes                                                            | Effect                                     |
| -------------------------------------------------------------------- | ------------------------------------------ |
| `fade-in`, `fade-out`                                                | Fade.                                      |
| `scale-in`, `scale-out`                                              | Grow in, shrink out.                       |
| `slide-from-top`, `-bottom`, `-left`, `-right`                       | Slide in a short way.                      |
| `slide-to-top`, `-bottom`, `-left`, `-right`                         | Slide out a short way.                     |
| `expand-height`, `collapse-height`, `expand-width`, `collapse-width` | Open and close to content size. See below. |
| `spin`, `ping`, `pulse`, `bounce`                                    | Loops.                                     |

Add `-full` to a slide, such as `slide-from-bottom-full`, to travel the
element's full size.

The expand and collapse keyframes read the size from `--height` or `--width`.
`Collapsible` sets both on its content.

## Timing

| Duration variable          | Value   |
| -------------------------- | ------- |
| `--lui-durations-fastest`  | `50ms`  |
| `--lui-durations-faster`   | `100ms` |
| `--lui-durations-fast`     | `150ms` |
| `--lui-durations-moderate` | `200ms` |
| `--lui-durations-slow`     | `300ms` |
| `--lui-durations-slower`   | `400ms` |
| `--lui-durations-slowest`  | `500ms` |

Easings: `--lui-easings-ease-in`, `-ease-out`, `-ease-in-out`, and
`-ease-in-smooth`.

Loops come ready to use: `animation: var(--lui-animations-spin)`. Also
`-ping`, `-pulse`, and `-bounce`.

Full lists: [durations](../theme-variables/durations.md),
[easings](../theme-variables/easings.md), and
[animations](../theme-variables/animations.md).

## Reduced motion

The built-in `Dialog`, `Drawer`, `Menu`, `Popover`, and `Tooltip` animations
do not shorten themselves for people who ask for less motion. Add this rule
once.

```css
@media (prefers-reduced-motion: reduce) {
  [data-state='open'],
  [data-state='closed'] {
    animation-duration: 1ms;
  }
}
```

- Keep the rule on `data-state`. A rule for everything turns loops such as
  `Spinner` into a flicker. `Marquee`, `Skeleton`, and indeterminate `Progress`
  already handle reduced motion.
- `animation: none` also works, and `Presence` then removes closing content at
  once. `1ms` keeps `animationend` events firing.
- No `!important` needed in ordinary CSS. Inside a cascade layer of your own,
  order it after the `lui.*` layers or add `!important`.

For your own animations, add a calmer version in the same stylesheet.

```css
.details-panel[data-state='open'] {
  animation-name: slide-from-bottom, fade-in;
  animation-duration: var(--lui-durations-slow);
}

@media (prefers-reduced-motion: reduce) {
  .details-panel[data-state='open'] {
    animation-name: fade-in;
  }
}
```
