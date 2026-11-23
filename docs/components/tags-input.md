# Tags Input

A text field where each value the user enters becomes a removable tag.

```tsx
import { TagsInput } from '@leverui/components';
```

```tsx
<TagsInput.Root>
  <TagsInput.Label />
  <TagsInput.Control>
    <TagsInput.Item>
      <TagsInput.ItemPreview>
        <TagsInput.ItemText />
        <TagsInput.ItemDeleteTrigger />
      </TagsInput.ItemPreview>
      <TagsInput.ItemInput />
    </TagsInput.Item>
    <TagsInput.Input />
  </TagsInput.Control>
</TagsInput.Root>
```

## Shortcuts

### TagsInputItems

`TagsInputItems` renders one item for every tag in the current value.

```tsx
<TagsInput.Context>
  {(api) => (
    <For each={api().value}>
      {(tag, index) => (
        <TagsInput.Item index={index()} value={tag}>
          <TagsInput.ItemPreview>
            <TagsInput.ItemText>{tag}</TagsInput.ItemText>
            <TagsInput.ItemDeleteTrigger />
          </TagsInput.ItemPreview>
          <TagsInput.ItemInput />
        </TagsInput.Item>
      )}
    </For>
  )}
</TagsInput.Context>
```

Shorter, if you do not customize the items:

```tsx
<TagsInput.Items />
```

## Props

### Root

| Prop                   | Default                   | Type                                                                                                     | Description                                              |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `delimiter`            | `,`                       | `string \| RegExp`                                                                                       | Key that adds a tag. Also separates pasted values.       |
| `max`                  | `Infinity`                | `number`                                                                                                 | Most tags allowed.                                       |
| `sanitizeValue`        | `(value) => value.trim()` | `(value: string) => string`                                                                              | Clean up a tag value before it is added.                 |
| `colorPalette`         | `gray`                    | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                           |
| `size`                 | `md`                      | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                                           | Tags input size. Responsive.                             |
| `variant`              | `outline`                 | `'outline' \| 'subtle' \| 'flushed'`                                                                     | Tags input style. Responsive.                            |
| `as`                   | `div`                     | Native HTML tag                                                                                          | HTML tag to render.                                      |
| `asChild`              | —                         | Solid render function                                                                                    | Render your own element with the part's props.           |
| `unstyled`             | `false`                   | `boolean`                                                                                                | Turn off the default styles. Behavior and parts stay.    |
| `addOnPaste`           | `false`                   | `boolean`                                                                                                | Add tags from pasted values.                             |
| `allowDuplicates`      | `false`                   | `boolean`                                                                                                | Allow the same tag more than once.                       |
| `allowOverflow`        | —                         | `boolean`                                                                                                | Let tags go over `max`. The root is then marked invalid. |
| `autoFocus`            | —                         | `boolean`                                                                                                | Focus the input on first render.                         |
| `blurBehavior`         | —                         | `'clear' \| 'add'`                                                                                       | On blur, add the typed text as a tag or clear it.        |
| `defaultInputValue`    | —                         | `string`                                                                                                 | Starting input text.                                     |
| `defaultValue`         | —                         | `string[]`                                                                                               | Starting tags.                                           |
| `disabled`             | —                         | `boolean`                                                                                                | Disable the tags input.                                  |
| `editable`             | `false`                   | `boolean`                                                                                                | Edit a highlighted tag with `Enter` or a double click.   |
| `form`                 | —                         | `string`                                                                                                 | Form the underlying input belongs to.                    |
| `id`                   | —                         | `string`                                                                                                 | Unique id.                                               |
| `ids`                  | —                         | Element ID map                                                                                           | Ids of the elements.                                     |
| `inputValue`           | —                         | `string`                                                                                                 | Input text, when you control it.                         |
| `invalid`              | —                         | `boolean`                                                                                                | Mark the tags input invalid.                             |
| `maxLength`            | —                         | `number`                                                                                                 | Most characters allowed in the input.                    |
| `name`                 | —                         | `string`                                                                                                 | `name` attribute submitted with the form.                |
| `onFocusOutside`       | —                         | `(event: FocusOutsideEvent) => void`                                                                     | Called when focus moves outside.                         |
| `onHighlightChange`    | —                         | `(details: HighlightChangeDetails) => void`                                                              | Called when a tag is highlighted.                        |
| `onInputValueChange`   | —                         | `(details: InputValueChangeDetails) => void`                                                             | Called when the input text changes.                      |
| `onInteractOutside`    | —                         | `(event: InteractOutsideEvent) => void`                                                                  | Called on an interaction outside.                        |
| `onPointerDownOutside` | —                         | `(event: PointerDownOutsideEvent) => void`                                                               | Called on pointer down outside.                          |
| `onValueChange`        | —                         | `(details: ValueChangeDetails) => void`                                                                  | Called when the tags change.                             |
| `onValueInvalid`       | —                         | `(details: ValidityChangeDetails) => void`                                                               | Called when `max` is reached or validation fails.        |
| `placeholder`          | —                         | `string`                                                                                                 | Input placeholder text.                                  |
| `readOnly`             | —                         | `boolean`                                                                                                | Make the tags input read-only.                           |
| `required`             | —                         | `boolean`                                                                                                | Mark the tags input required.                            |
| `translations`         | —                         | `IntlTranslations`                                                                                       | Translated text for assistive technology.                |
| `validate`             | —                         | `(details: ValidateArgs) => boolean`                                                                     | Decide whether a tag can be added.                       |
| `value`                | —                         | `string[]`                                                                                               | Tags, when you control them.                             |

### Item

| Prop       | Default | Type                  | Description                                    |
| ---------- | ------- | --------------------- | ---------------------------------------------- |
| `index`    | —       | `string \| number`    | Position of the item in the list. Required.    |
| `value`    | —       | `string`              | Tag value of the item. Required.               |
| `as`       | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild`  | —       | Solid render function | Render your own element with the part's props. |
| `disabled` | —       | `boolean`             | Disable the item.                              |

Form submit: set `name` on `Root` and include `HiddenInput`. The tags are then
in the browser's `FormData`. Inside `Field`, link the input to the helper text
with `aria-describedby`. Check for duplicates in `validate`. Delete tags
through the item parts, which carry an index.

`Items` renders the current tags by index and adds no wrapper element. For
per-tag content or styling, use `Context`, `Item`, `ItemPreview`, `ItemText`,
`ItemDeleteTrigger`, and `ItemInput` directly. `PropsProvider` can take an
accessor, so shared defaults can change without replacing the root.

Suggestions: create the Tags Input state and the Combobox state yourself, with
one shared input element and the same label, input, and control IDs. Render
`Combobox.Control` through `TagsInput.Control` with `asChild` so the popup is
positioned against the tags control. Pass the shared label ID to
`TagsInput.Label` as `id`.

## Customize with CSS

The root and every public part have stable `.leverui-tags-input__*` classes.
Override those or the `--lui-*` theme tokens. `class` and `style` also
work. `--lui-private-tags-input-*` variables are for internal sizing.

```css
.email-tags .leverui-tags-input__control {
  border-radius: 1rem;
}

.email-tags {
  --lui-colors-color-palette-subtle: #e0f2fe;
}
```

Add `class="email-tags"` to `TagsInput.Root` to scope these to one field. Load
your CSS after `styles.css`.

## Explorer

Click a part name to highlight it in the preview.
