# Progress

A bar that fills to show how far a task has progressed.

```tsx
import { Progress } from '@leverui/components';
```

```tsx
<Progress.Root>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
  <Progress.Label />
  <Progress.ValueText />
</Progress.Root>
```

## Closed Component

Wraps the parts in one component that takes props. Uses
[`InfoTip`](toggle-tip.md).

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { InfoTip, Progress, type ProgressRootProps } from '@leverui/components';

export type ClosedProgressProps = ProgressRootProps & {
  showValueText?: boolean | undefined;
  valueText?: JSX.Element;
  label?: JSX.Element;
  info?: JSX.Element;
};

export function ClosedProgress(props: ClosedProgressProps) {
  const root = omit(props, 'showValueText', 'valueText', 'label', 'info');

  return (
    <Progress.Root {...root}>
      <Show when={props.label}>
        <Progress.Label>
          {props.label}{' '}
          <Show when={props.info}>
            <InfoTip>{props.info}</InfoTip>
          </Show>
        </Progress.Label>
      </Show>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
      <Show when={props.showValueText}>
        <Progress.ValueText>{props.valueText}</Progress.ValueText>
      </Show>
    </Progress.Root>
  );
}
```

## Guides

### Values and composition

Pass `value` to control the progress, or `defaultValue` to let the component
track it. `min` and `max` set the range. `value={null}` is the indeterminate
state: the track has no `aria-valuenow`. Set `orientation="vertical"` for a
vertical bar.

`useProgress` creates the state outside the component, to pass to
`Progress.RootProvider`. `useProgressContext` and `Progress.Context` read the
nearest one. `ProgressPropsProvider` sets reactive default props for the roots
inside it. A prop on a root wins.

### Accessibility

`Track` gets `role="progressbar"` and the value attributes. `Progress.Label` is
not linked automatically: give it an ID and point `aria-labelledby` on `Track`
at it. For a label rendered elsewhere, point `aria-labelledby` at that text, or
set `aria-label` on `Track`.

`ValueText` is a polite live region, so screen readers announce each change.
For a fast task, update the text at a pace that is useful to hear.

## Props

### Root

| Prop            | Default                | Type                                                                                                     | Description                                    |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `defaultValue`  | `50`                   | `number`                                                                                                 | Starting value, when you do not control it.    |
| `formatOptions` | `{ style: 'percent' }` | `NumberFormatOptions`                                                                                    | Options for formatting the value.              |
| `locale`        | `'en-US'`              | `string`                                                                                                 | Locale for formatting the value.               |
| `max`           | `100`                  | `number`                                                                                                 | Largest value.                                 |
| `orientation`   | `'horizontal'`         | `'horizontal' \| 'vertical'`                                                                             | Bar direction.                                 |
| `colorPalette`  | `'gray'`               | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                 |
| `variant`       | `'outline'`            | `'outline' \| 'subtle'`                                                                                  | Bar style.                                     |
| `shape`         | `'rounded'`            | `'square' \| 'rounded' \| 'full'`                                                                        | Bar shape.                                     |
| `size`          | `'md'`                 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                   | Bar size.                                      |
| `as`            | —                      | `'div'`                                                                                                  | HTML tag to render.                            |
| `asChild`       | —                      | Solid render function                                                                                    | Render your own element with the root's props. |
| `unstyled`      | —                      | `boolean`                                                                                                | Turn off the Lever UI styles.                  |
| `id`            | —                      | `string`                                                                                                 | Unique id for the progress bar.                |
| `ids`           | —                      | `Partial<{ root: string; track: string; label: string; circle: string }>`                                | Ids for the elements in the progress bar.      |
| `min`           | `0`                    | `number`                                                                                                 | Smallest value.                                |
| `onValueChange` | —                      | `(details: ValueChangeDetails) => void`                                                                  | Called when the value changes.                 |
| `translations`  | —                      | `IntlTranslations`                                                                                       | Translated messages.                           |
| `value`         | —                      | `number \| null`                                                                                         | Value, when you control it.                    |
| `striped`       | —                      | `boolean`                                                                                                | Add stripes.                                   |
| `animated`      | —                      | `boolean`                                                                                                | Animate the stripes.                           |

## Customize with CSS

Import `@leverui/components/styles.css` before your own stylesheet. Set the
public `--lui-*` variables or style the stable `.leverui-progress__*`
classes, such as `.leverui-progress__range`.

Track variables: `--lui-progress-track-height`,
`--lui-progress-track-color`, and `--lui-progress-track-radius`. Range
variable: `--lui-progress-range-color`.

`unstyled` turns off the default styles but keeps the semantics and the styling
hooks. `class` and `style` work on any part.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
