# Listbox

A list of options that stays open on the page, from which the user picks one or
several.

```tsx
import { Listbox } from '@leverui/components';
```

```tsx
<Listbox.Root>
  <Listbox.Label />
  <Listbox.Content>
    <Listbox.List>
      <Listbox.Item>
        <Listbox.ItemText />
        <Listbox.ItemIndicator />
      </Listbox.Item>
    </Listbox.List>
  </Listbox.Content>
</Listbox.Root>
```

Options come from a list collection. Use `useListCollection`, or
`createListCollection` for fixed items, and pass the collection to `Root`. A
`useListCollection` collection is an accessor: call `collection()` to read it.

`Listbox.Label` gives the accessible name. The indicator shows a check icon
unless you pass it a child. Give each option clear text, and hide decorative
icons from assistive technology. `Listbox.useListboxItemContext()` returns
reactive `selected` and `disabled` values for an item.

## Props

### Root

| Prop                      | Default    | Type                                   | Description                                                                                        |
| ------------------------- | ---------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `collection`\*            | —          | `ListCollection<T>`                    | Collection that holds the items.                                                                   |
| `defaultValue`            | `[]`       | `string[]`                             | Selected values on first render. Uncontrolled.                                                     |
| `orientation`             | `vertical` | `'horizontal' \| 'vertical'`           | Direction the items are laid out in.                                                               |
| `selectionMode`           | `single`   | `'single' \| 'multiple' \| 'extended'` | `single`: one item. `multiple`: several, no modifier key. `extended`: several with a modifier key. |
| `colorPalette`            | `gray`     | `string`                               | Color palette, built-in or your own.                                                               |
| `variant`                 | `subtle`   | `'subtle' \| 'solid' \| 'plain'`       | Listbox style.                                                                                     |
| `as`                      | `div`      | Native HTML tag                        | HTML tag to render.                                                                                |
| `asChild`                 | —          | Solid render function                  | Render your own element with the part's props.                                                     |
| `unstyled`                | —          | `boolean`                              | Turn off the Lever UI styles.                                                                      |
| `defaultHighlightedValue` | —          | `string`                               | Highlighted item's value on first open. Uncontrolled.                                              |
| `deselectable`            | —          | `boolean`                              | Let the user deselect the selected item.                                                           |
| `disabled`                | —          | `boolean`                              | Disable the listbox.                                                                               |
| `disallowSelectAll`       | —          | `boolean`                              | Stop `meta+a` from selecting every item.                                                           |
| `highlightedValue`        | —          | `string`                               | Highlighted item's value. Controlled.                                                              |
| `id`                      | —          | `string`                               | Unique id for the listbox.                                                                         |
| `ids`                     | —          | Element ID map                         | Ids for the listbox's elements. For use with other components.                                     |
| `loopFocus`               | `false`    | `boolean`                              | Wrap keyboard navigation from the last option to the first.                                        |
| `onHighlightChange`       | —          | `(details) => void`                    | Called when the highlighted item changes.                                                          |
| `onSelect`                | —          | `(details) => void`                    | Called when an item is selected.                                                                   |
| `onValueChange`           | —          | `(details) => void`                    | Called when the selected item changes.                                                             |
| `scrollToIndexFn`         | —          | `(details) => void`                    | Scrolls to the item at a given index.                                                              |
| `selectOnHighlight`       | —          | `boolean`                              | Select an item as soon as it is highlighted.                                                       |
| `typeahead`               | —          | `boolean`                              | Typing moves to the matching item.                                                                 |
| `value`                   | —          | `string[]`                             | Selected values. Controlled.                                                                       |

`Listbox.useListbox` returns an accessor for the state machine. Pass it to
`Listbox.RootProvider` as `value`. `Listbox.Context` and `Listbox.ItemContext`
give the machine's reactive state. `Listbox.useListboxContext()` reads it
inside the root.

`Listbox.PropsProvider` sets default props for the listboxes inside it, from an
object or an accessor. A prop on a listbox wins. On `RootProvider`, defaults
change only the look, not the collection or selection.

Not a native form control, so a form does not submit its selection. Use
`onValueChange` to copy the value into a form field.

### Label

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `span`  | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### Input

| Prop               | Default | Type                    | Description                                                                                                         |
| ------------------ | ------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `keyboardPriority` | `caret` | `'caret' \| 'navigate'` | For keys that could edit text or move the list. `caret`: edit text. `navigate`: send supported keys to the listbox. |
| `as`               | `input` | Native HTML tag         | HTML tag to render.                                                                                                 |
| `asChild`          | —       | Solid render function   | Render your own element with the part's props.                                                                      |
| `autoHighlight`    | `false` | `boolean`               | Highlight the item as you type.                                                                                     |

### Content

Styled box around `List`. Headers, footers, `Empty`, and `Status` go inside it,
next to `List`.

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### List

Has the listbox role, takes keyboard focus and tracks the active item. Items
and item groups go inside it.

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### Item

| Prop               | Default | Type                  | Description                                    |
| ------------------ | ------- | --------------------- | ---------------------------------------------- |
| `as`               | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild`          | —       | Solid render function | Render your own element with the part's props. |
| `highlightOnHover` | —       | `boolean`             | Highlight the item on pointer hover.           |
| `item`             | —       | `any`                 | Item to render.                                |

### ItemText

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `span`  | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### ItemIndicator

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### ItemGroup

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### ItemGroupLabel

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

## Customize with CSS

Import `@leverui/components/styles.css` once. `variant` is responsive, such as
`variant={{ base: 'plain', md: 'solid' }}`, and shows on the element as
`data-variant` attributes. `colorPalette` on the root sets the selection color
`solid` uses.

`class` and `style` work on the root and on any part. Each part has a stable
class name.

```css
.my-listbox {
  --lui-listbox-content-max-height: 18rem;
  --lui-listbox-selected-background: #fef08a;
}

.my-listbox .lui-listbox__item {
  border-radius: 0.75rem;
}
```

`unstyled` on the root turns off the Lever UI styles for every part. On one
part, it resets only that part. Selection, focus, and accessibility attributes
keep working. With `asChild`, keep the part's props on your element so focus
and keyboard behavior still work.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
