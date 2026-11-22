# Combobox

A text input with a list of suggestions that narrows as the user types.

```tsx
import { Combobox } from '@leverui/components';
```

```tsx
<Combobox.Root>
  <Combobox.Label />

  <Combobox.Control>
    <Combobox.Input />
    <Combobox.IndicatorGroup>
      <Combobox.ClearTrigger />
      <Combobox.Trigger />
    </Combobox.IndicatorGroup>
  </Combobox.Control>

  <Combobox.Positioner>
    <Combobox.Content>
      <Combobox.Empty />
      <Combobox.List>
        <Combobox.Item />

        <Combobox.ItemGroup>
          <Combobox.ItemGroupLabel />
          <Combobox.Item />
        </Combobox.ItemGroup>
      </Combobox.List>
    </Combobox.Content>
  </Combobox.Positioner>
</Combobox.Root>
```

- `useListCollection`: holds the items, with methods to filter and change the
  list.

- `useFilter`: matching logic for filtering, built on
  [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator).

Keep the popup inside the same `Combobox.Root` in your code, even when `Portal`
moves its DOM. Roles and form attributes are set for you. Give an icon-only
trigger an accessible name.

## Guides

### Controlling the value

Pass `value` and `onValueChange`. If you change the value from outside while
the list is filtered, the input can show up empty. Call `reset()` first.

```tsx
const { collection, filter, reset } = useListCollection({
  initialItems: items,
  filter: (text, query) => matcher().contains(text, query),
});

// When changing value externally, reset the filter first
function setValueWithReset(next: string[]) {
  reset();
  setValue(next);
}
```

Fixed list: pass the result of `createListCollection`. Filter as people type:
call `useListCollection` in a Solid component, pass `collection()` to Root, and
call `filter(details.inputValue)` from `onInputValueChange`. The items in the
collection and the `Item` parts you render must match.

Put the items inside `List`. It has the listbox role and handles keyboard
focus. `Content` is the popup around it and can hold a header, a footer, or a
search input. Place `Empty` and `Status` next to `List` inside `Content`.
`Empty` is a polite status region that shows its children only while the
collection is empty. `Status` announces loading or error messages without
adding them to the options.

To own the state, call `Combobox.useCombobox()` in the body of a Solid
component and pass the accessor it returns to `Combobox.RootProvider`.
`Combobox.PropsProvider` takes default props as an object or an accessor. A
prop on a combobox wins. `Combobox.Context` and `Combobox.ItemContext` give the
current state of the combobox and of one item.

## Props

### Root

| Prop                      | Default                         | Type                                                         | Description                                                                                                              |
| ------------------------- | ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `collection` (required)   | —                               | `ListCollection<T>`                                          | Collection that holds the items.                                                                                         |
| `defaultValue`            | `[]`                            | `string[]`                                                   | Selected items on first render. Uncontrolled.                                                                            |
| `inputBehavior`           | `none`                          | `'none' \| 'autohighlight' \| 'autocomplete'`                | How the input auto-completes as you type.                                                                                |
| `loopFocus`               | `true`                          | `boolean`                                                    | Wrap keyboard navigation from the last item to the first.                                                                |
| `openOnChange`            | `true`                          | `boolean \| ((details: InputValueChangeDetails) => boolean)` | Open the popup when the input text changes.                                                                              |
| `openOnKeyPress`          | `true`                          | `boolean`                                                    | Open the popup on an arrow key.                                                                                          |
| `positioning`             | `{ placement: "bottom-start" }` | `PositioningOptions`                                         | Where the popup is placed.                                                                                               |
| `selectionBehavior`       | `replace`                       | `'clear' \| 'replace' \| 'preserve'`                         | What happens to the input text on select.                                                                                |
| `variant`                 | `outline`                       | `'outline' \| 'subtle' \| 'flushed'`                         | Combobox style.                                                                                                          |
| `size`                    | `md`                            | `'xs' \| 'sm' \| 'md' \| 'lg'`                               | Combobox size.                                                                                                           |
| `as`                      | `div`                           | Native tag                                                   | HTML tag to render.                                                                                                      |
| `asChild`                 | —                               | Solid render function                                        | Render your own element with the combobox's props.                                                                       |
| `unstyled`                | —                               | `boolean`                                                    | Turn off the default styles.                                                                                             |
| `allowCustomValue`        | —                               | `boolean`                                                    | Allow a typed value that is not in the list.                                                                             |
| `alwaysSubmitOnEnter`     | `false`                         | `boolean`                                                    | Submit the form on Enter, even with the popup open.                                                                      |
| `autoFocus`               | —                               | `boolean`                                                    | Focus the input on first render.                                                                                         |
| `closeOnSelect`           | —                               | `boolean`                                                    | Close the popup when an item is selected.                                                                                |
| `defaultHighlightedValue` | —                               | `string`                                                     | Highlighted item on first render. Uncontrolled.                                                                          |
| `defaultInputValue`       | ``                              | `string`                                                     | Input text on first render. Uncontrolled.                                                                                |
| `defaultOpen`             | —                               | `boolean`                                                    | Open the popup on first render. Uncontrolled.                                                                            |
| `disabled`                | —                               | `boolean`                                                    | Disable the combobox.                                                                                                    |
| `form`                    | —                               | `string`                                                     | Form the combobox belongs to.                                                                                            |
| `highlightedValue`        | —                               | `string`                                                     | Highlighted item. Controlled.                                                                                            |
| `id`                      | —                               | `string`                                                     | Unique ID for this combobox.                                                                                             |
| `ids`                     | —                               | Element ID map                                               | Your own ids for the combobox elements.                                                                                  |
| `immediate`               | —                               | `boolean`                                                    | Apply a `present` change right away. When `false`, wait a frame.                                                         |
| `inputValue`              | —                               | `string`                                                     | Input text. Controlled.                                                                                                  |
| `invalid`                 | —                               | `boolean`                                                    | Mark the combobox invalid.                                                                                               |
| `lazyMount`               | `false`                         | `boolean`                                                    | Render the popup content only once it first opens.                                                                       |
| `multiple`                | —                               | `boolean`                                                    | Allow more than one selected item. Sets `selectionBehavior` to `clear`. Show the selected items in a separate container. |
| `name`                    | —                               | `string`                                                     | `name` attribute of the input, for form submit.                                                                          |
| `navigate`                | —                               | `(details: NavigateDetails) => void`                         | Function that navigates to the selected item.                                                                            |
| `onExitComplete`          | —                               | `VoidFunction`                                               | Called when the closing animation finishes.                                                                              |
| `onFocusOutside`          | —                               | `(event: FocusOutsideEvent) => void`                         | Called when focus moves outside the combobox.                                                                            |
| `onHighlightChange`       | —                               | `(details: HighlightChangeDetails<T>) => void`               | Called when the pointer or keyboard highlights an item.                                                                  |
| `onInputValueChange`      | —                               | `(details: InputValueChangeDetails) => void`                 | Called when the input text changes.                                                                                      |
| `onInteractOutside`       | —                               | `(event: InteractOutsideEvent) => void`                      | Called on an interaction outside the combobox.                                                                           |
| `onOpenChange`            | —                               | `(details: OpenChangeDetails) => void`                       | Called when the popup opens or closes.                                                                                   |
| `onPointerDownOutside`    | —                               | `(event: PointerDownOutsideEvent) => void`                   | Called on a pointer press outside the combobox.                                                                          |
| `onSelect`                | —                               | `(details: SelectionDetails) => void`                        | Called when an item is selected.                                                                                         |
| `onValueChange`           | —                               | `(details: ValueChangeDetails<T>) => void`                   | Called when the selected value changes.                                                                                  |
| `open`                    | —                               | `boolean`                                                    | Whether the popup is open. Controlled.                                                                                   |
| `openOnClick`             | `false`                         | `boolean`                                                    | Open the popup when the input is first clicked.                                                                          |
| `placeholder`             | —                               | `string`                                                     | Placeholder text of the input.                                                                                           |
| `present`                 | —                               | `boolean`                                                    | Whether the popup content is present. Controlled.                                                                        |
| `readOnly`                | —                               | `boolean`                                                    | Make it read-only. No edits, but still interactive.                                                                      |
| `required`                | —                               | `boolean`                                                    | Mark the combobox required.                                                                                              |
| `scrollToIndexFn`         | —                               | `(details: ScrollToIndexDetails) => void`                    | Function that scrolls to the item at an index.                                                                           |
| `skipAnimationOnMount`    | `false`                         | `boolean`                                                    | Skip the animation the first time the popup appears.                                                                     |
| `translations`            | —                               | `IntlTranslations`                                           | Localized text for accessible names and states.                                                                          |
| `unmountOnExit`           | `false`                         | `boolean`                                                    | Remove the popup content from the page on close.                                                                         |
| `value`                   | —                               | `string[]`                                                   | Selected items. Controlled.                                                                                              |

### Item

| Prop           | Default | Type                  | Description                                          |
| -------------- | ------- | --------------------- | ---------------------------------------------------- |
| `as`           | `div`   | Native tag            | HTML tag to render.                                  |
| `asChild`      | —       | Solid render function | Render your own element with the item's props.       |
| `item`         | —       | `any`                 | Item to render.                                      |
| `persistFocus` | —       | `boolean`             | Keep the highlight when the pointer leaves the item. |

`Trigger`, `ClearTrigger`, and `ItemIndicator` show a default icon without
children. The parts the combobox controls accept `asChild` and `as`. Keep the
props you are given on your element, or keyboard and accessibility behavior
breaks.

## Customize with CSS

Import `@leverui/components/styles.css`, then set `--leverui-combobox-*`
variables on `:root`, a theme wrapper, or a single Combobox. The root and its
parts have `data-size`, `data-variant`, and interaction state attributes.
Content moved by a portal gets the same size and variant attributes. Each part
has a stable class.

```css
.leverui-combobox__input {
  border-radius: 0.75rem;
}
```

Each part accepts `class`, `style`, and `unstyled`.

## Explorer

Click a part name to highlight it in the preview.
