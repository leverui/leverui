# Switch

A toggle that turns a setting on or off right away.

```tsx
import { Switch } from '@leverui/components';
```

```tsx
<Switch.Root>
  <Switch.HiddenInput />
  <Switch.Control>
    <Switch.Thumb />
  </Switch.Control>
  <Switch.Label />
</Switch.Root>
```

For a single component, see the [snippet below](#closed-component).

## Shortcuts

### SwitchControl

`Switch.Control` renders a `Switch.Thumb` by default.

```tsx
<Switch.Control>
  <Switch.Thumb />
</Switch.Control>
```

Same as:

```tsx
<Switch.Control />
```

## Closed Component

One component that wraps the parts.

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Switch, type SwitchRootProps } from '@leverui/components';

interface SwitchLabels {
  on: JSX.Element;
  off: JSX.Element;
}

export type ClosedSwitchProps = SwitchRootProps & {
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement> | undefined;
  trackLabel?: SwitchLabels | undefined;
  thumbLabel?: SwitchLabels | undefined;
};

export function ClosedSwitch(props: ClosedSwitchProps) {
  const root = omit(props, 'inputProps', 'trackLabel', 'thumbLabel', 'children');

  return (
    <Switch.Root {...root}>
      <Switch.HiddenInput {...props.inputProps} />
      <Switch.Control>
        <Switch.Thumb>
          <Show when={props.thumbLabel}>
            {(labels) => (
              <Switch.ThumbIndicator fallback={labels().off}>{labels().on}</Switch.ThumbIndicator>
            )}
          </Show>
        </Switch.Thumb>
        <Show when={props.trackLabel}>
          {(labels) => <Switch.Indicator fallback={labels().off}>{labels().on}</Switch.Indicator>}
        </Show>
      </Switch.Control>
      <Show when={props.children}>
        <Switch.Label>{props.children}</Switch.Label>
      </Show>
    </Switch.Root>
  );
}
```

```tsx
<ClosedSwitch>Email notifications</ClosedSwitch>
```

## Props

### Root

| Prop              | Default | Type                                                                                                     | Description                                      |
| ----------------- | ------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `value`           | `on`    | `string \| number`                                                                                       | Input value, sent on form submit.                |
| `colorPalette`    | `gray`  | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                   |
| `variant`         | `solid` | `'solid' \| 'raised'`                                                                                    | Switch style.                                    |
| `size`            | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                                           | Switch size.                                     |
| `as`              | `label` | Native HTML tag                                                                                          | HTML tag to render.                              |
| `asChild`         | —       | Solid render function                                                                                    | Render your own element with the switch's props. |
| `unstyled`        | `false` | `boolean`                                                                                                | Turn off the default styles.                     |
| `checked`         | —       | `boolean`                                                                                                | On state, when you control it.                   |
| `defaultChecked`  | —       | `boolean`                                                                                                | Start on, when uncontrolled.                     |
| `disabled`        | —       | `boolean`                                                                                                | Disable the switch.                              |
| `ids`             | —       | Element ID map                                                                                           | Ids of the switch elements.                      |
| `invalid`         | —       | `boolean`                                                                                                | Mark the switch as invalid.                      |
| `label`           | —       | `string`                                                                                                 | Translated name for assistive technology.        |
| `name`            | —       | `string`                                                                                                 | Input name, sent on form submit.                 |
| `onCheckedChange` | —       | `(details: { checked: boolean }) => void`                                                                | Called when the user clicks the switch.          |
| `readOnly`        | —       | `boolean`                                                                                                | Make the switch read-only.                       |
| `required`        | —       | `boolean`                                                                                                | Mark the switch input as required.               |

`Root` renders a `label`, so clicking the control toggles the hidden checkbox.
With another `as` tag, add the labeling and the click behavior yourself.

Keep `HiddenInput` in every Switch. It provides the checkbox role, focus,
validation, and form submission.

`FormData` includes the value only when the switch is on. To submit an
explicit `false`, control the switch with a signal.

`Indicator` and `ThumbIndicator` show their `children` when on and their
`fallback` when off.

`RootProvider` takes state you create with `useSwitch`. `PropsProvider` gives
`Root` default state and appearance props, and `RootProvider` only the
appearance defaults.

`Context` and `useSwitchContext` give the current switch's state, for building
your own parts.

## Customize with CSS

Override the `--lui-*` theme tokens, or target the `.leverui-switch__*`
classes for one-off styling. `class` and `style` work on the root and on every
part.

Set `unstyled` on `Root` to turn off the default styles for the whole switch,
or on one part for that part only.

## Explorer

Click a part name to highlight it in the preview.
