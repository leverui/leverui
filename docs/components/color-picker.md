# Color Picker

Lets the user choose a color with a color area, sliders, swatches, or a typed
value.

```tsx
import { ColorPicker } from '@leverui/components';
```

```tsx
<ColorPicker.Root>
  <ColorPicker.HiddenInput />
  <ColorPicker.Label />
  <ColorPicker.Control>
    <ColorPicker.Input />
    <ColorPicker.Trigger />
  </ColorPicker.Control>
  <ColorPicker.Positioner>
    <ColorPicker.Content>
      <ColorPicker.Area />
      <ColorPicker.EyeDropper />
      <ColorPicker.Sliders />
      <ColorPicker.SwatchGroup>
        <ColorPicker.SwatchTrigger>
          <ColorPicker.Swatch />
        </ColorPicker.SwatchTrigger>
      </ColorPicker.SwatchGroup>
    </ColorPicker.Content>
  </ColorPicker.Positioner>
</ColorPicker.Root>
```

## Shortcuts

### ColorPicker.ChannelSlider

```tsx
<ColorPicker.ChannelSlider />
```

Same as:

```tsx
<ColorPicker.ChannelSlider>
  <ColorPicker.TransparencyGrid />
  <ColorPicker.ChannelSliderTrack />
  <ColorPicker.ChannelSliderThumb />
</ColorPicker.ChannelSlider>
```

### ColorPicker.Sliders

Same as:

```tsx
<Stack>
  <ColorPicker.ChannelSlider channel="hue" />
  <ColorPicker.ChannelSlider channel="alpha" />
</Stack>
```

### ColorPicker.Area

```tsx
<ColorPicker.Area>
  <ColorPicker.AreaThumb />
  <ColorPicker.AreaBackground />
</ColorPicker.Area>
```

Same as:

```tsx
<ColorPicker.Area />
```

### ColorPicker.EyeDropper

Same as:

```tsx
<ColorPicker.EyeDropperTrigger
  asChild={(getProps) => (
    <IconButton {...getProps()}>
      <PipetteIcon />
    </IconButton>
  )}
/>
```

## Guide

### Getting the hex code

The `value` object's `toString()` takes the format you want.

```tsx
<ColorPicker.Root
  onValueChange={(details) => {
    console.log(details.value.toString('hex')); // "#ff0000"
    console.log(details.value.toString('hexa')); // "#ff0000ff" (with alpha)
    console.log(details.value.toString('rgb')); // "rgb(255, 0, 0)"
    console.log(details.value.toString('css')); // CSS color string
  }}
>
  {/* ... */}
</ColorPicker.Root>
```

From the store:

```tsx
const picker = useColorPicker(); // or useColorPickerContext()
const hexValue = picker().value.toString('hex'); // "#ff0000"
```

From a `parseColor` color:

```tsx
import { parseColor } from '@leverui/components';

const color = parseColor('#ff0000');
console.log(color.toString('hex')); // "#ff0000"
console.log(color.toString('rgba')); // "rgba(255, 0, 0, 1)"
```

## Props

### Root

| Prop                   | Default   | Type                                                     | Description                                                 |
| ---------------------- | --------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| `defaultFormat`        | `'rgba'`  | `ColorFormat`                                            | Starting color format.                                      |
| `defaultValue`         | `#000000` | `Color`                                                  | Starting color.                                             |
| `openAutoFocus`        | `true`    | `boolean`                                                | Move focus into the picker when it opens.                   |
| `size`                 | `md`      | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | Picker size. Responsive.                                    |
| `variant`              | `outline` | `'outline' \| 'subtle'`                                  | Picker style. Responsive.                                   |
| `as`                   | `div`     | Native tag                                               | HTML tag to render.                                         |
| `asChild`              | —         | Solid render function                                    | Render your own element with the picker's props.            |
| `unstyled`             | —         | `boolean`                                                | Turn off the Lever UI styles.                               |
| `closeOnSelect`        | `false`   | `boolean`                                                | Close when the user picks a swatch.                         |
| `defaultOpen`          | —         | `boolean`                                                | Start open.                                                 |
| `disabled`             | —         | `boolean`                                                | Disable the picker.                                         |
| `format`               | —         | `ColorFormat`                                            | Color format, when you control it.                          |
| `id`                   | —         | `string`                                                 | Unique id for the picker.                                   |
| `ids`                  | —         | Element ID map                                           | Ids of the elements inside the picker.                      |
| `immediate`            | —         | `boolean`                                                | Whether `present` changes apply right away or are deferred. |
| `initialFocusEl`       | —         | `() => HTMLElement \| null`                              | Returns the element to focus on open.                       |
| `inline`               | —         | `boolean`                                                | Show the picker inline.                                     |
| `invalid`              | —         | `boolean`                                                | Mark the picker invalid.                                    |
| `lazyMount`            | `false`   | `boolean`                                                | Render the content only once the picker first opens.        |
| `name`                 | —         | `string`                                                 | Form input name.                                            |
| `onExitComplete`       | —         | `VoidFunction`                                           | Called when the closing animation ends.                     |
| `onFocusOutside`       | —         | `(event: FocusOutsideEvent) => void`                     | Called when focus moves outside the picker.                 |
| `onFormatChange`       | —         | `(details: FormatChangeDetails) => void`                 | Called when the color format changes.                       |
| `onInteractOutside`    | —         | `(event: InteractOutsideEvent) => void`                  | Called on interaction outside the picker.                   |
| `onOpenChange`         | —         | `(details: OpenChangeDetails) => void`                   | Called when the picker opens or closes.                     |
| `onPointerDownOutside` | —         | `(event: PointerDownOutsideEvent) => void`               | Called on pointer down outside the picker.                  |
| `onValueChange`        | —         | `(details: ValueChangeDetails) => void`                  | Called on every value change, including during a drag.      |
| `onValueChangeEnd`     | —         | `(details: ValueChangeDetails) => void`                  | Called when the user stops dragging.                        |
| `open`                 | —         | `boolean`                                                | Open state, when you control it.                            |
| `positioning`          | —         | `PositioningOptions`                                     | Popup placement options.                                    |
| `present`              | —         | `boolean`                                                | Whether the content is present, when you control it.        |
| `readOnly`             | —         | `boolean`                                                | Make the picker read-only.                                  |
| `required`             | —         | `boolean`                                                | Mark the picker required.                                   |
| `skipAnimationOnMount` | `false`   | `boolean`                                                | Skip the animation on the first render.                     |
| `unmountOnExit`        | `false`   | `boolean`                                                | Remove the content from the DOM on close.                   |
| `value`                | —         | `Color`                                                  | Color value, when you control it.                           |

To hold the state yourself, create it with `ColorPicker.useColorPicker` and
pass the returned accessor to `ColorPicker.RootProvider`.

`ColorPicker.PropsProvider` sets reactive default props for the roots inside
it. `ColorPicker.Context` and `useColorPickerContext` read the nearest color
picker's state.

With `Root` and `RootProvider`, size and variant also reach content in a
portal.

`getColorChannels(format)` returns the editable channel names for `rgba`,
`hsla`, `hsba`, or `hexa`.

`ColorPicker.EyeDropper` uses the browser's eye dropper API when there is one.
Give its icon button an accessible name, such as `aria-label`.

## Customize with CSS

Part classes: `.leverui-color-picker__<slot>`. `Sliders` uses
`.leverui-color-picker__sliders`. Variables:

- `--lui-color-picker-root-gap`
- `--lui-color-picker-trigger-height` and
  `--lui-color-picker-focus-color`
- `--lui-color-picker-content-width`,
  `--lui-color-picker-content-background`, and
  `--lui-color-picker-z-index`
- `--lui-color-picker-area-height`, `--lui-color-picker-thumb-size`, and
  `--lui-color-picker-slider-height`
- `--lui-color-picker-swatch-size`

Inline styles set the live gradients, thumb positions, and swatch colors. A
`style` you pass is merged with them.

## Explorer

Click a part name to highlight it in the preview.
