# Slider

Lets the user pick a value, or a range, by dragging a handle along a track.

```tsx
import { Slider } from '@leverui/components';
```

```tsx
<Slider.Root>
  <Slider.Label />
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumb index={0}>
      <Slider.DraggingIndicator />
      <Slider.HiddenInput />
    </Slider.Thumb>
    <Slider.MarkerGroup>
      <Slider.Marker value={0} />
    </Slider.MarkerGroup>
  </Slider.Control>
</Slider.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Shortcuts

### `Slider.Thumbs`

`Slider.Thumbs` renders a `Slider.Thumb` and a `Slider.HiddenInput` for each
value.

```tsx
<Slider.Thumb index={0}>
  <Slider.HiddenInput />
</Slider.Thumb>
```

Shorter, if you don't need to change the thumb:

```tsx
<Slider.Thumbs />
```

### `Slider.Marks`

`Slider.Marks` renders a `Slider.MarkerGroup` with a `Slider.Marker` for each
value.

```tsx
<Slider.MarkerGroup>
  <Slider.Marker value={0} />
  <Slider.Marker value={50} />
</Slider.MarkerGroup>
```

Shorter, if you don't need to change the marker:

```tsx
<Slider.Marks marks={[0, 50]} />
```

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import {
  HStack,
  Slider as LeverUISlider,
  type SliderMarksProps,
  type SliderRootProps,
} from '@leverui/components';

export type ClosedSliderProps = SliderRootProps & {
  marks?: SliderMarksProps['marks'];
  label?: JSX.Element;
  showValue?: boolean;
};

export function ClosedSlider(props: ClosedSliderProps) {
  const root = omit(props, 'label', 'marks', 'showValue');

  return (
    <LeverUISlider.Root thumbAlignment="center" {...root}>
      <Show when={props.label && !props.showValue}>
        <LeverUISlider.Label>{props.label}</LeverUISlider.Label>
      </Show>
      <Show when={props.label && props.showValue}>
        <HStack justify="space-between">
          <LeverUISlider.Label>{props.label}</LeverUISlider.Label>
          <LeverUISlider.ValueText />
        </HStack>
      </Show>
      <LeverUISlider.Control>
        <LeverUISlider.Track>
          <LeverUISlider.Range />
        </LeverUISlider.Track>
        <LeverUISlider.Thumbs />
        <LeverUISlider.Marks marks={props.marks ?? []} />
      </LeverUISlider.Control>
    </LeverUISlider.Root>
  );
}
```

## Guides

Controlled: `value` and `onValueChange`, which receives an object with a
`value: number[]` array. Uncontrolled: `defaultValue`. An array of two numbers
makes a range slider.

Give each `Thumb` its `index`, from zero, and put a `HiddenInput` inside it. Or
use `Thumbs`, which creates both for each current value.
`minStepsBetweenThumbs` and `thumbCollisionBehavior` set what happens when range
thumbs meet.

`Marks` takes numbers and `{ value, label }` objects. For your own mark layout,
use `MarkerGroup`, `Marker`, `MarkerIndicator`, and `MarkerLabel`.
`DraggingIndicator` shows the value while a thumb is dragged.

`RootProvider` takes state you created with `useSlider` and uses that state's
orientation. If you set `orientation` on `RootProvider`, keep it the same as the
state's.

`PropsProvider` gives `Root` default behavior and appearance props, and
`RootProvider` default appearance props. `Context` and `useSliderContext` give
the current slider state.

`size` and `variant` are responsive: pass a breakpoint object or an array.
`orientation` takes one value only. Give a vertical slider a height in CSS.
`disabled` or `readOnly` on `Root` stops changes.

### Forms and controlled values

Give `Root` a `name` to send the values with a form. The native inputs send
them: `Thumbs` creates the inputs, or you put one inside each `Thumb`.

A form controller can keep the value in a `number[]` signal. Pass it to `value`
and copy `details.value` into it in `onValueChange`. When `onFocusChange`
reports `focusedIndex === -1`, call the controller's blur handler.

Keep validation state on the `Field.Root` around the slider. Show the error
with `Field.ErrorText` and give it an id. While validation fails, pass
`aria-invalid` and `aria-describedby` through `Thumbs`. Remove them when the
value is fixed.

### Compositions

`colorPalette` sets the color. A vertical slider can have `Marks` with labels.
Steps of ten work with contained and centered thumbs.

Your own SVG can go inside a `Thumb` if the native input stays inside it too.
`Slider.Thumbs` creates the inputs and keeps them in step with the values. Use
`Thumb` directly to change what is inside it.

Your own wrapper can add a label, value text, and marks around the public parts.
With no value text, put the label directly under `Root`. Keep the state only in
`Root`.

## Props

### Root

| Prop                     | Default      | Type                                                                                                                                                                                                                      | Description                                                                |
| ------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `largeStep`              | `10 * step`  | `number`                                                                                                                                                                                                                  | Step with `Shift` held, or on `PageUp` or `PageDown`.                      |
| `max`                    | `100`        | `number`                                                                                                                                                                                                                  | Largest allowed value.                                                     |
| `orientation`            | `horizontal` | `'vertical' \| 'horizontal'`                                                                                                                                                                                              | Slider direction.                                                          |
| `origin`                 | `start`      | `'center' \| 'start' \| 'end'`                                                                                                                                                                                            | Where the fill starts. With one value, fills from the origin to the thumb. |
| `step`                   | `1`          | `number`                                                                                                                                                                                                                  | Size of one step.                                                          |
| `thumbAlignment`         | `contain`    | `'center' \| 'contain'`                                                                                                                                                                                                   | Thumb alignment with the track.                                            |
| `thumbCollisionBehavior` | `none`       | `'none' \| 'push' \| 'swap'`                                                                                                                                                                                              | What thumbs do when one is dragged into another.                           |
| `colorPalette`           | `gray`       | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'`                                                                                                                  | Color palette.                                                             |
| `size`                   | `md`         | `'sm' \| 'md' \| 'lg'` or responsive map                                                                                                                                                                                  | Slider size.                                                               |
| `variant`                | `outline`    | `'outline' \| 'solid'` or responsive map                                                                                                                                                                                  | Slider style.                                                              |
| `as`                     | `div`        | Native HTML tag                                                                                                                                                                                                           | HTML tag to render.                                                        |
| `asChild`                | —            | Solid render function                                                                                                                                                                                                     | Render your own element with the root's props.                             |
| `unstyled`               | `false`      | `boolean`                                                                                                                                                                                                                 | Turn off the Lever UI styles.                                              |
| `aria-label`             | —            | `string[]`                                                                                                                                                                                                                | `aria-label` for each thumb.                                               |
| `aria-labelledby`        | —            | `string[]`                                                                                                                                                                                                                | `id` of the elements that label each thumb.                                |
| `defaultValue`           | —            | `number[]`                                                                                                                                                                                                                | Value on first render.                                                     |
| `disabled`               | —            | `boolean`                                                                                                                                                                                                                 | Disable the slider.                                                        |
| `form`                   | —            | `string`                                                                                                                                                                                                                  | Form the hidden inputs belong to.                                          |
| `getAriaValueText`       | —            | `(details: ValueTextDetails) => string`                                                                                                                                                                                   | Return a thumb's value as readable text.                                   |
| `id`                     | —            | `string`                                                                                                                                                                                                                  | Unique id for the slider.                                                  |
| `ids`                    | —            | `Partial<{ root: string; thumb: (index: number) => string; hiddenInput: (index: number) => string; control: string; track: string; range: string; label: string; valueText: string; marker: (index: number) => string }>` | Ids for the slider parts.                                                  |
| `invalid`                | —            | `boolean`                                                                                                                                                                                                                 | Mark the slider as invalid.                                                |
| `min`                    | `0`          | `number`                                                                                                                                                                                                                  | Smallest allowed value.                                                    |
| `minStepsBetweenThumbs`  | `0`          | `number`                                                                                                                                                                                                                  | Fewest steps allowed between two thumbs.                                   |
| `name`                   | —            | `string`                                                                                                                                                                                                                  | Form name for each thumb's value.                                          |
| `onFocusChange`          | —            | `(details: FocusChangeDetails) => void`                                                                                                                                                                                   | Called when the focused thumb index changes.                               |
| `onValueChange`          | —            | `(details: ValueChangeDetails) => void`                                                                                                                                                                                   | Called when the value changes.                                             |
| `onValueChangeEnd`       | —            | `(details: ValueChangeDetails) => void`                                                                                                                                                                                   | Called when a value change finishes.                                       |
| `readOnly`               | —            | `boolean`                                                                                                                                                                                                                 | Make the slider read-only.                                                 |
| `thumbSize`              | —            | `{ width: number; height: number }`                                                                                                                                                                                       | Thumb width and height.                                                    |
| `value`                  | —            | `number[]`                                                                                                                                                                                                                | Slider value, when you control it.                                         |

## Customize with CSS

Load the package stylesheet once. Variables: `--lui-slider-thumb-size`,
`--lui-slider-track-size`, `--lui-slider-marker-size`,
`--lui-slider-track-color`, `--lui-slider-range-color`,
`--lui-slider-thumb-color`, `--lui-slider-thumb-border-color`.

Every part has a stable `.leverui-slider__*` class and state attributes for
selectors. `class` and `style` work on the root and every part. `unstyled`
turns off the default styles and keeps the behavior.

```css
.volume-slider {
  --lui-slider-thumb-size: 1.75rem;
  --lui-slider-range-color: rebeccapurple;
}
```

Put `class="volume-slider"` on `Slider.Root`. Style one part with a selector
such as `.leverui-slider__thumb`, or a state with
`.leverui-slider__thumb[data-focus-visible]`.

## Explorer

Click a part name to highlight it in the preview.
