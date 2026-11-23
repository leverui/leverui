# Command

A searchable list of commands, often opened with a keyboard shortcut.

```tsx
import { Command, Portal, useCommandCollection } from '@leverui/components';
```

```tsx
<Command.Provider>
  <Command.Dialog>
    <Command.DialogTrigger />
    <Portal>
      <Command.DialogBackdrop />
      <Command.DialogContent>
        <Command.Root>
          <Command.Label />
          <Command.Control>
            <Command.Indicator />
            <Command.Input />
            <Command.ClearTrigger />
          </Command.Control>
          <Command.List>
            <Command.Loading />
            <Command.ItemGroup>
              <Command.ItemGroupLabel />
              <Command.Item>
                <Command.ItemText />
                <Command.ItemCommand />
              </Command.Item>
            </Command.ItemGroup>
            <Command.Separator />
            <Command.Empty />
          </Command.List>
          <Command.Footer />
        </Command.Root>
      </Command.DialogContent>
    </Portal>
  </Command.Dialog>
</Command.Provider>
```

`useCommandCollection` ranks the items as you type. `Command.Provider` shares
the result with the dialog and the root.

```tsx
const command = useCommandCollection({ initialItems: commands });

<Command.Provider value={command}>
  <Command.Dialog>
    <Portal>
      <Command.DialogBackdrop />
      <Command.DialogContent>
        <Command.Root>{/* ... */}</Command.Root>
      </Command.DialogContent>
    </Portal>
  </Command.Dialog>
</Command.Provider>;
```

- Selecting an item runs its `onSelect` and closes the dialog. Set
  `closeOnSelect: false` on the item or on `Root` to keep it open.
- Holding ⌘, Ctrl, Shift, or Alt while selecting keeps the dialog open.
  `onSelect` gets the keys as `modifiers`.
- The query clears after the dialog closes.
- `Command.DialogBackdrop` is optional.
- `disabled: true` on an item shows it but stops it from running.
- No default shortcut opens the dialog. Bind ⌘K with your app's own hotkey
  tool, as the Hotkeys example does.

Command only runs actions. To pick and keep a value, use Combobox or Listbox.

## Props

Every part takes `as`, an HTML tag, and `asChild`, a Solid function that
renders your own element with the part's props.

### Root

| Prop                      | Default | Type                                         | Description                                                                 |
| ------------------------- | ------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `command`                 | —       | `UseCommandCollectionReturn<T>`              | Collection from `useCommandCollection`. Optional inside `Command.Provider`. |
| `collection`              | —       | `ListCollection<T>`                          | Plain list collection, without `useCommandCollection`.                      |
| `size`                    | `md`    | `'sm' \| 'md' \| 'lg'`                       | Component size. Responsive.                                                 |
| `colorPalette`            | `gray`  | Color palette name                           | Color palette.                                                              |
| `loading`                 | `false` | `boolean \| undefined`                       | Show `Spinner` and `Loading`; mark the panel and indicator as loading.      |
| `closeOnSelect`           | `true`  | `boolean \| undefined`                       | Close on select.                                                            |
| `onSelect`                | —       | `(details: CommandSelectionDetails) => void` | Called on select, after the item's own `onSelect`.                          |
| `onClose`                 | —       | `() => void`                                 | Called when selecting an ordinary action closes the dialog.                 |
| `inputValue`              | —       | `string`                                     | Controlled input value. Prefer `query` on `useCommandCollection`.           |
| `defaultInputValue`       | —       | `string`                                     | Initial input value.                                                        |
| `onInputValueChange`      | —       | `(details: InputValueChangeDetails) => void` | Called on input change, after the query updates.                            |
| `highlightedValue`        | —       | `string`                                     | Controlled value of the highlighted item.                                   |
| `defaultHighlightedValue` | —       | `string`                                     | Value of the item highlighted at the start.                                 |
| `onHighlightChange`       | —       | `(details: HighlightChangeDetails) => void`  | Called when the highlighted item changes.                                   |
| `navigate`                | —       | `(details: NavigateDetails) => void`         | Navigate to the selected item.                                              |
| `scrollToIndexFn`         | —       | `(details: ScrollToIndexDetails) => void`    | Scroll the list to an index.                                                |
| `id`                      | —       | `string`                                     | Unique id for the component.                                                |
| `ids`                     | —       | Element ID map                               | Ids for the component's elements.                                           |
| `unstyled`                | —       | `boolean`                                    | Turn off the Lever UI styles.                                               |

No props for hotkeys or for keeping a selection. Add shortcuts with
`useHotkeys`, as in Hotkeys. Keep a selection with `closeOnSelect={false}` and
`onSelect`, as in Toggle Items.

### RootProvider

Pass the machine from `useCommand` to `Command.RootProvider` as `value`. Also
takes the appearance props above.

### Label

Renders a `label`. Accepts `as` and `asChild`.

### Input

Renders an `input`. Accepts `as` and `asChild`.

### Control

Renders a `div`. Accepts `as` and `asChild`.

### Indicator

Renders a `div`. Accepts `as` and `asChild`.

### List

Renders a `div`. Accepts `as` and `asChild`.

### Loading

Renders a `div`. Accepts `as` and `asChild`.

### Item

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `item`    | —       | `T`                   | Collection item to render.                     |
| `asChild` | —       | Solid render function | Render your own element with the item's props. |

Set `onSelect` and `closeOnSelect` on the item's data in `initialItems`. Its
`onSelect` runs before the Root one, and its `closeOnSelect` overrides Root's.

### ItemText

| Prop        | Default | Type                  | Description                                    |
| ----------- | ------- | --------------------- | ---------------------------------------------- |
| `highlight` | —       | `boolean`             | Bold the characters that match the query.      |
| `asChild`   | —       | Solid render function | Render your own element with the text's props. |

### ItemGroup

Renders a `div`. Accepts `as` and `asChild`.

### ItemGroupLabel

Renders a `div`. Accepts `as` and `asChild`.

### ItemCommand

Renders a `kbd`. Accepts `as` and `asChild`.

### Empty

Renders a `div`. Accepts `as` and `asChild`.

### Separator

Renders a `div`. Accepts `as` and `asChild`.

### Footer

Renders a `div`. Accepts `as` and `asChild`.

## Customize with CSS

Set `--lui-command-*` variables or style the `.lui-command__*` part
classes. `Command.DialogContent` has the class
`.lui-command-dialog__content`. Its hidden title and description use
`.lui-command-dialog__accessible-label` and name the dialog, input, and
list. `unstyled` on the root turns off the Lever UI styles.
