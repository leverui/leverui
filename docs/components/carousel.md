# Carousel

Shows a set of slides one at a time, with buttons, dots, or swipes to move
between them.

```tsx
import { Carousel } from '@leverui/components';
```

```tsx
<Carousel.Root>
  <Carousel.ItemGroup>
    <Carousel.Item />
  </Carousel.ItemGroup>
  <Carousel.Control>
    <Carousel.AutoplayTrigger>
      <Carousel.AutoplayIndicator />
    </Carousel.AutoplayTrigger>
    <Carousel.PrevTrigger />
    <Carousel.Indicators />
    <Carousel.NextTrigger />
    <Carousel.ProgressText />
  </Carousel.Control>
</Carousel.Root>
```

## Shortcuts

### Carousel.Indicators

Renders one indicator per slide. Replaces:

```tsx
<Carousel.IndicatorGroup>
  <For each={items} keyed={false}>
    {(_, index) => <Carousel.Indicator index={index} />}
  </For>
</Carousel.IndicatorGroup>
```

With:

```tsx
<Carousel.Indicators />
```

## Props

### Root

| Prop                     | Default      | Type                           | Description                                      |
| ------------------------ | ------------ | ------------------------------ | ------------------------------------------------ |
| `count`                  | required     | `number`                       | Total number of slides.                          |
| `inViewThreshold`        | `0.6`        | `number \| number[]`           | Visible share of a slide that counts as in view. |
| `orientation`            | `horizontal` | `'horizontal' \| 'vertical'`   | Scroll direction.                                |
| `slidesPerMove`          | `auto`       | `number \| 'auto'`             | Slides to scroll at a time.                      |
| `slidesPerPage`          | `1`          | `number`                       | Slides shown at a time.                          |
| `snapType`               | `mandatory`  | `'proximity' \| 'mandatory'`   | How strictly scrolling snaps to a slide.         |
| `spacing`                | `1rem`       | `string`                       | Space between slides.                            |
| `as`                     | `div`        | Native HTML tag                | HTML tag to render.                              |
| `asChild`                | —            | Solid render function          | Render your own element with the part's props.   |
| `unstyled`               | `false`      | `boolean`                      | Turn off the Lever UI styles.                    |
| `allowMouseDrag`         | `false`      | `boolean`                      | Scroll by dragging with a mouse.                 |
| `autoPlay`               | `false`      | `boolean \| { delay: number }` | Advance on its own. Default delay: 4000ms.       |
| `autoSize`               | `false`      | `boolean`                      | Let slides have different widths.                |
| `defaultPage`            | `0`          | `number`                       | Starting page.                                   |
| `ids`                    | —            | Element ID map                 | Your own ids, in place of the generated ones.    |
| `loop`                   | `false`      | `boolean`                      | Wrap from the last slide to the first, and back. |
| `onAutoplayStatusChange` | —            | `(details) => void`            | Called when the autoplay status changes.         |
| `onDragStatusChange`     | —            | `(details) => void`            | Called when the drag status changes.             |
| `onPageChange`           | —            | `(details) => void`            | Called when the page changes.                    |
| `page`                   | —            | `number`                       | Current page, when you control it.               |
| `translations`           | —            | `IntlTranslations`             | Translated text for the built-in labels.         |

### ItemGroup

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### Item

| Prop        | Default  | Type                           | Description                                    |
| ----------- | -------- | ------------------------------ | ---------------------------------------------- |
| `index`     | required | `number`                       | Position in the list of slides.                |
| `snapAlign` | `start`  | `'center' \| 'start' \| 'end'` | Where the item lines up when it snaps.         |
| `as`        | `div`    | Native HTML tag                | HTML tag to render.                            |
| `asChild`   | —        | Solid render function          | Render your own element with the part's props. |

### Control

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

Give the root an accessible name, such as `aria-label`. Label each icon-only
trigger too.

## Explorer

Click a part name to highlight it in the preview.
