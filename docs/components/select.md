# Select

A button that opens a list of options to pick from.

```tsx
import { Select } from '@leverui/components';
```

```tsx
<Select.Root>
  <Select.HiddenSelect />
  <Select.Label />

  <Select.Control>
    <Select.Trigger>
      <Select.ValueText />
    </Select.Trigger>
    <Select.IndicatorGroup>
      <Select.Indicator />
      <Select.ClearTrigger />
    </Select.IndicatorGroup>
  </Select.Control>

  <Select.Positioner>
    <Select.Content>
      <Select.List>
        <Select.Item />

        <Select.ItemGroup>
          <Select.ItemGroupLabel />
          <Select.Item />
        </Select.ItemGroup>
      </Select.List>
    </Select.Content>
  </Select.Positioner>
</Select.Root>
```

Create the collection with `Select.useListCollection`. It holds the items and
the value and label of each one.

Put the items inside `Select.List`. It has the `listbox` role and takes keyboard
focus. `Select.Content` is the popup around the list. For a loading or error
message, put `Select.Status` next to the list.

## Guides

### Machine state and helpers

Control a Select with `value` and `onValueChange`. The callback's
`details.value` is a `string[]`. `defaultValue` sets the first selection
without controlling it. `multiple` allows more than one value. Disabled items
stay visible but cannot be selected. `disabled` and `readOnly` on `Root` apply
to the whole field.

`ItemGroup` and `ItemGroupLabel` group options. `RootProvider` takes a
`useSelect` machine that you create outside the component. `PropsProvider` sets
default props for the roots inside it. `Context`, `ItemContext`,
`useSelectContext`, and `useSelectItemContext` give you the machine state for
custom parts. The collection helpers live under `Select`:
`Select.createListCollection` and `Select.useListCollection`.

### Forms and validation

For native `FormData`, put `HiddenSelect` inside a `Root` that has a `name`.
With a Solid form controller, pass its signal to `value` and copy
`details.value` back into it in `onValueChange`. Set `invalid` when validation
fails. Pass `onInteractOutside` to the controller's blur or touched handler, so
the field state updates when someone leaves the popup.

### Custom options

For items with their own shape, `itemToString` and `itemToValue` tell the
collection each item's label and value. Avatars: use the member ID as the value
and show the avatar and name. Countries: group by continent, show each flag, and
submit the country code as the value.

An icon-only trigger needs an accessible name. Read `Select.useSelectContext()`
and spread its `getTriggerProps()` onto your own square `IconButton`. Work out
the icon from the selected value in the collection, so it updates with the
selection.

### Select inside overlays

In a Dialog or Popover, keep `Select.Positioner` inside the overlay's content.
Do not portal it to the document body, so the listbox stays where the overlay
holds focus. Keep `HiddenSelect` inside the named root, so native form values
work.

## Props

### Root

| Prop                      | Default   | Type                                                                                                                                                                                                                                                                                       | Description                                                                           |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `collection` (required)   | —         | `ListCollection<T>`                                                                                                                                                                                                                                                                        | Items to choose from.                                                                 |
| `closeOnSelect`           | `true`    | `boolean`                                                                                                                                                                                                                                                                                  | Close after an item is selected.                                                      |
| `variant`                 | `outline` | `'outline' \| 'subtle' \| 'ghost'`                                                                                                                                                                                                                                                         | Select style.                                                                         |
| `size`                    | `md`      | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                                                                                                                                                                                                                             | Select size.                                                                          |
| `as`                      | `div`     | Native tag                                                                                                                                                                                                                                                                                 | HTML tag to render.                                                                   |
| `asChild`                 | —         | Solid render function                                                                                                                                                                                                                                                                      | Render your own element with the root's props.                                        |
| `unstyled`                | —         | `boolean`                                                                                                                                                                                                                                                                                  | Turn off the default styles.                                                          |
| `autoComplete`            | —         | `string`                                                                                                                                                                                                                                                                                   | `autocomplete` attribute for the hidden select, such as "address-level1" for a state. |
| `defaultHighlightedValue` | —         | `string`                                                                                                                                                                                                                                                                                   | Item highlighted when the select opens, when uncontrolled.                            |
| `defaultOpen`             | —         | `boolean`                                                                                                                                                                                                                                                                                  | Open at first, when uncontrolled.                                                     |
| `defaultValue`            | —         | `string[]`                                                                                                                                                                                                                                                                                 | Values selected at first, when uncontrolled.                                          |
| `deselectable`            | —         | `boolean`                                                                                                                                                                                                                                                                                  | Clear the value when the selected item is clicked. Single selection only.             |
| `disabled`                | —         | `boolean`                                                                                                                                                                                                                                                                                  | Disable the select.                                                                   |
| `form`                    | —         | `string`                                                                                                                                                                                                                                                                                   | Form the underlying select belongs to.                                                |
| `highlightedValue`        | —         | `string`                                                                                                                                                                                                                                                                                   | Value of the highlighted item, when controlled.                                       |
| `id`                      | —         | `string`                                                                                                                                                                                                                                                                                   | Unique id of the state machine.                                                       |
| `ids`                     | —         | `Partial<{ root: string content: string control: string trigger: string clearTrigger: string label: string hiddenSelect: string positioner: string item: (id: string \| number) => string itemGroup: (id: string \| number) => string itemGroupLabel: (id: string \| number) => string }>` | Ids of the elements in the select.                                                    |
| `immediate`               | —         | `boolean`                                                                                                                                                                                                                                                                                  | Apply a change to `present` at once, not on the next frame.                           |
| `invalid`                 | —         | `boolean`                                                                                                                                                                                                                                                                                  | Mark the select invalid.                                                              |
| `lazyMount`               | `false`   | `boolean`                                                                                                                                                                                                                                                                                  | Mount the popup content only when first opened.                                       |
| `loopFocus`               | `false`   | `boolean`                                                                                                                                                                                                                                                                                  | Wrap keyboard navigation at the first and last option.                                |
| `multiple`                | —         | `boolean`                                                                                                                                                                                                                                                                                  | Allow selecting more than one item.                                                   |
| `name`                    | —         | `string`                                                                                                                                                                                                                                                                                   | `name` attribute of the underlying select.                                            |
| `onExitComplete`          | —         | `VoidFunction`                                                                                                                                                                                                                                                                             | Called when the closing animation ends.                                               |
| `onFocusOutside`          | —         | `(event: FocusOutsideEvent) => void`                                                                                                                                                                                                                                                       | Called when focus moves outside the select.                                           |
| `onHighlightChange`       | —         | `(details: HighlightChangeDetails<T>) => void`                                                                                                                                                                                                                                             | Called when the highlighted item changes.                                             |
| `onInteractOutside`       | —         | `(event: InteractOutsideEvent) => void`                                                                                                                                                                                                                                                    | Called on an interaction outside the select.                                          |
| `onOpenChange`            | —         | `(details: OpenChangeDetails) => void`                                                                                                                                                                                                                                                     | Called when the popup opens or closes.                                                |
| `onPointerDownOutside`    | —         | `(event: PointerDownOutsideEvent) => void`                                                                                                                                                                                                                                                 | Called on a pointer press outside the select.                                         |
| `onSelect`                | —         | `(details: SelectionDetails) => void`                                                                                                                                                                                                                                                      | Called when an item is selected.                                                      |
| `onValueChange`           | —         | `(details: ValueChangeDetails<T>) => void`                                                                                                                                                                                                                                                 | Called when the selected item changes.                                                |
| `open`                    | —         | `boolean`                                                                                                                                                                                                                                                                                  | Whether the menu is open.                                                             |
| `positioning`             | —         | `PositioningOptions`                                                                                                                                                                                                                                                                       | Menu placement options.                                                               |
| `present`                 | —         | `boolean`                                                                                                                                                                                                                                                                                  | Whether the popup is present, when controlled.                                        |
| `readOnly`                | —         | `boolean`                                                                                                                                                                                                                                                                                  | Make the select read-only.                                                            |
| `required`                | —         | `boolean`                                                                                                                                                                                                                                                                                  | Make the select required.                                                             |
| `scrollToIndexFn`         | —         | `(details: ScrollToIndexDetails) => void`                                                                                                                                                                                                                                                  | Scroll to a given index.                                                              |
| `skipAnimationOnMount`    | `false`   | `boolean`                                                                                                                                                                                                                                                                                  | Skip the animation when the popup first mounts.                                       |
| `translations`            | —         | `IntlTranslations`                                                                                                                                                                                                                                                                         | Translated names for the accessible elements and their states.                        |
| `unmountOnExit`           | `false`   | `boolean`                                                                                                                                                                                                                                                                                  | Unmount the popup content when it closes.                                             |
| `value`                   | —         | `string[]`                                                                                                                                                                                                                                                                                 | Values of the selected items, when controlled.                                        |

## Customize with CSS

Import `@leverui/components/styles.css` once, before your own CSS. Built in:
`size="xs" | "sm" | "md" | "lg"` and `variant="outline" | "subtle" | "ghost"`,
both responsive. The root and its parts have `data-size` and `data-variant`
attributes, plus attributes for interaction states. The trigger fills its width
by default. Pass `positioning` to place the popup differently.

Set the `--lui-select-*` variables on `:root`, on an element that wraps a
themed area, or on one component. Or style the `.leverui-select__*` classes.
Every part takes `class` and `style`. `unstyled` turns off the default styles
but keeps the behavior.

Neutral colors by default. To color a trigger with a palette, set `colorPalette`
on `Root`, then use `--lui-colors-color-palette-muted`,
`--lui-colors-color-palette-subtle`, and `--lui-colors-color-palette-fg`
in your own CSS or in the `style` of `Trigger`.

## Explorer

Click a part name to highlight it in the preview.
