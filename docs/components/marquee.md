# Marquee

Scrolls content continuously across the screen, such as a row of logos.

```tsx
import { Marquee } from '@leverui/components';
```

```tsx
<Marquee.Root>
  <Marquee.Viewport>
    <Marquee.Content>
      <Marquee.Item />
    </Marquee.Content>
  </Marquee.Viewport>
</Marquee.Root>
```

## Guide

### CSS Variables

```tsx
<Marquee.Root
  style={{
    '--lui-marquee-duration': '30s',
    '--lui-marquee-delay': '0s',
    '--lui-marquee-loop-count': 'infinite',
    '--lui-marquee-edge-color': 'var(--lui-colors-bg)',
    '--lui-marquee-edge-size': '20%',
  }}
>
  {/* ... */}
</Marquee.Root>
```

| Variable                   | Description                                  | Default                |
| -------------------------- | -------------------------------------------- | ---------------------- |
| `--lui-marquee-duration`   | How long the animation takes                 | Computed               |
| `--lui-marquee-delay`      | How long to wait before the animation starts | `0s`                   |
| `--lui-marquee-loop-count` | How many times the animation runs            | `infinite`             |
| `--lui-marquee-edge-color` | The color of the fade at the edges           | `var(--lui-colors-bg)` |
| `--lui-marquee-edge-size`  | The size of the fade at the edges            | `20%`                  |

## Props

| Prop                 | Default | Type                                                                              | Description                                                     |
| -------------------- | ------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `side`               | `start` | `Side`                                                                            | Side the marquee scrolls towards.                               |
| `spacing`            | `1rem`  | `string`                                                                          | Space between items.                                            |
| `speed`              | `50`    | `number`                                                                          | Speed, in pixels per second.                                    |
| `as`                 | `div`   | Native tag                                                                        | HTML tag to render.                                             |
| `asChild`            | —       | Solid render function                                                             | Render your own element with the marquee's props.               |
| `unstyled`           | —       | `boolean`                                                                         | Turn off the Lever UI styles.                                   |
| `autoFill`           | `false` | `boolean`                                                                         | Repeat the content until it fills the container.                |
| `defaultPaused`      | `false` | `boolean`                                                                         | Start paused.                                                   |
| `delay`              | `0`     | `number`                                                                          | Wait before the animation starts, in seconds.                   |
| `ids`                | —       | `Partial<{ root: string; viewport: string; content: (index: number) => string }>` | Ids for the marquee's elements. For use with other components.  |
| `loopCount`          | `0`     | `number`                                                                          | Number of loops. `0` loops forever.                             |
| `onComplete`         | —       | `() => void`                                                                      | Called when all loops finish. Only when `loopCount` is above 0. |
| `onLoopComplete`     | —       | `() => void`                                                                      | Called after each loop.                                         |
| `onPauseChange`      | —       | `(details: PauseStatusDetails) => void`                                           | Called on pause or resume.                                      |
| `paused`             | —       | `boolean`                                                                         | Whether the marquee is paused.                                  |
| `pauseOnInteraction` | `false` | `boolean`                                                                         | Pause on hover or focus.                                        |
| `reverse`            | `false` | `boolean`                                                                         | Reverse the animation direction.                                |
| `translations`       | —       | `IntlTranslations`                                                                | Translated messages.                                            |

`translations.root` sets the accessible name of the moving region. Do not put
important information only in moving content, and respect reduced motion
settings. Edge fades must not hide item text that assistive technology needs.

## Customize with CSS

Each part has a stable `.leverui-marquee__*` class. `class` and `style` work on
the root, viewport, content, item, and edge. `unstyled` on the root or a part
turns off its default styles. Behavior stays the same.

```tsx
<Marquee.Root class="featured-marquee" spacing="24px">
  {/* Marquee parts */}
</Marquee.Root>
```

```css
.featured-marquee {
  --lui-marquee-edge-size: 12%;
  --lui-marquee-edge-color: var(--page-background);
  --lui-marquee-duration: 30s;
}

.featured-marquee .leverui-marquee__item {
  padding-inline: 1rem;
}
```

The root also has `--lui-marquee-spacing`. The measurement variables the
marquee sets inline are internal.
