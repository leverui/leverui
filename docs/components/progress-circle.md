# Progress Circle

A ring that fills to show how far a task has progressed.

```tsx
import { ProgressCircle } from '@leverui/components';
```

```tsx
<ProgressCircle.Root>
  <ProgressCircle.Circle>
    <ProgressCircle.Track />
    <ProgressCircle.Range />
  </ProgressCircle.Circle>
  <ProgressCircle.ValueText />
</ProgressCircle.Root>
```

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { AbsoluteCenter, ProgressCircle, type ProgressCircleRootProps } from '@leverui/components';

export type ClosedProgressCircleProps = ProgressCircleRootProps & {
  showValueText?: boolean | undefined;
  valueText?: JSX.Element;
  trackColor?: string | undefined;
  color?: string | undefined;
  cap?: 'butt' | 'round' | 'square' | undefined;
  thickness?: string | undefined;
};

export function ClosedProgressCircle(props: ClosedProgressCircleProps) {
  const root = omit(props, 'showValueText', 'valueText', 'trackColor', 'color', 'cap', 'thickness');

  return (
    <ProgressCircle.Root {...root}>
      <ProgressCircle.Circle
        style={props.thickness ? { '--lui-progress-circle-thickness': props.thickness } : {}}
      >
        <ProgressCircle.Track stroke={props.trackColor} />
        <ProgressCircle.Range stroke={props.color} strokeLinecap={props.cap ?? 'butt'} />
      </ProgressCircle.Circle>
      <Show when={props.showValueText}>
        <AbsoluteCenter>
          <ProgressCircle.ValueText>{props.valueText}</ProgressCircle.ValueText>
        </AbsoluteCenter>
      </Show>
    </ProgressCircle.Root>
  );
}
```

## Guide

### Customizing indeterminate color

Style `[data-state='indeterminate']` for the ring while progress is unknown.

```tsx
<ProgressCircle.Range class="loading-range" />
```

```css
.loading-range[data-state='indeterminate'] {
  stroke: var(--lui-colors-purple-500);
}
```

### Values and composition

`value` is controlled. `defaultValue` sets a starting value the component
tracks. `min` and `max` set the range. `ValueText` shows a formatted
percentage. Set `value={null}` for unknown progress: `Circle` leaves out
`aria-valuenow` and the ring animates, except under reduced motion.

`useProgress` creates the progress state machine outside the component. Pass it
to `ProgressCircle.RootProvider`. `ProgressCircle.Context` gives your own parts
the nearest machine. `ProgressCirclePropsProvider` sets default props for the
roots inside it. Defaults can be reactive. A prop on a root wins.

The root is a positioned container, so `AbsoluteCenter` works inside it. In a
grid that stretches its items, wrap the root or set `justify-self: start` so
the root stays as wide as the ring.

### Accessibility

Link a visible `Label` to `Circle` with `aria-labelledby`, or set `aria-label`
on `Circle`. They are not linked automatically. The ARIA value attributes are
on `Circle`. `ValueText` is a polite live region, so update an announced value
only as often as is useful.

## Props

### Root

| Prop           | Default  | Type                                                                                                     | Description                                    |
| -------------- | -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `colorPalette` | `'gray'` | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                 |
| `size`         | `'md'`   | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                   | Component size.                                |
| `as`           | `div`    | Native HTML tag                                                                                          | HTML tag to render.                            |
| `asChild`      | —        | Solid render function                                                                                    | Render your own element with the root's props. |
| `unstyled`     | —        | `boolean`                                                                                                | Turn off the Lever UI styles.                  |

## Customize with CSS

Import `@leverui/components/styles.css` before your own stylesheet. Set
`--lui-progress-circle-size` or `--lui-progress-circle-thickness` on a
Circle root. Default thickness: 4, 5, 6, 7, or 8 pixels, smallest size to
largest. For a single SVG, `Circle` also accepts `--size` and `--thickness`.

Arc colors: `--lui-progress-circle-track-color` and
`--lui-progress-circle-range-color`. Classes:
`.lui-progress-circle__*`.

`unstyled` turns off the default styles but keeps the SVG semantics. `size` can
come from a signal and is responsive, as an object or an array. `class` and
`style` still work.
