# Accordion

A stack of headings that each show or hide a section of content. Use it to keep
a long page short.

```tsx
import { Accordion } from '@leverui/components';
```

```tsx
<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.ItemTrigger>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody />
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

## Guides

### Accessing Root State

Use `useAccordionContext` inside `Accordion.Root`. It returns a function. Call
it on every read so the text updates.

```tsx
import { Accordion, Box, useAccordionContext } from '@leverui/components';

function AccordionValueText() {
  const accordion = useAccordionContext();
  return <Box>Opened: {accordion().value.join(', ')}</Box>;
}

export function Demo() {
  return (
    <Accordion.Root collapsible defaultValue={['item-1']}>
      <AccordionValueText />
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          Details <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### Accessing Item State

`useAccordionItemContext` returns a function. Call it inside the item so the
label updates.

```tsx
import { Accordion, Box, useAccordionItemContext } from '@leverui/components';

function AccordionItemStatus() {
  const item = useAccordionItemContext();
  return (
    <Box
      style={{
        color: item().expanded ? 'var(--lui-colors-green-fg)' : 'var(--lui-colors-fg-muted)',
      }}
    >
      {item().expanded ? 'Expanded' : 'Collapsed'}
    </Box>
  );
}

export function Demo() {
  return (
    <Accordion.Root collapsible>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>
          <AccordionItemStatus />
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>Content</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

## Props

### Root

| Prop            | Default    | Type                                                               | Description                                           |
| --------------- | ---------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `orientation`   | `vertical` | `'horizontal' \| 'vertical'`                                       | Layout direction of the items.                        |
| `colorPalette`  | `gray`     | `string`                                                           | Color palette, built-in or your own.                  |
| `variant`       | `outline`  | `'outline' \| 'subtle' \| 'enclosed' \| 'plain'` or responsive map | Accordion style.                                      |
| `size`          | `md`       | `'sm' \| 'md' \| 'lg'` or responsive map                           | Item size.                                            |
| `as`            | `div`      | Native HTML tag                                                    | HTML tag to render.                                   |
| `asChild`       | —          | Solid render function                                              | Render your own element with the accordion's props.   |
| `unstyled`      | `false`    | `boolean`                                                          | Turn off the Lever UI styles.                         |
| `collapsible`   | `false`    | `boolean`                                                          | Let people close the open item.                       |
| `defaultValue`  | —          | `string[]`                                                         | Values of the items open at first.                    |
| `disabled`      | `false`    | `boolean`                                                          | Disable every item.                                   |
| `id`            | —          | `string`                                                           | Unique id for this accordion.                         |
| `ids`           | —          | Element ID map                                                     | Your own ids for the root, item, trigger, or content. |
| `lazyMount`     | `false`    | `boolean`                                                          | Render an item's content when it first opens.         |
| `multiple`      | `false`    | `boolean`                                                          | Allow more than one open item.                        |
| `onFocusChange` | —          | `(details) => void`                                                | Called when focus moves to another item.              |
| `onValueChange` | —          | `(details) => void`                                                | Called when the open items change.                    |
| `unmountOnExit` | `false`    | `boolean`                                                          | Remove an item's content after it closes.             |
| `value`         | —          | `string[]`                                                         | Values of the open items, when you control them.      |

### Item

| Prop       | Default  | Type                  | Description                                    |
| ---------- | -------- | --------------------- | ---------------------------------------------- |
| `value`    | required | `string`              | Unique value for the item. Should not change.  |
| `as`       | `div`    | Native HTML tag       | HTML tag to render.                            |
| `asChild`  | —        | Solid render function | Render your own element with the item's props. |
| `disabled` | `false`  | `boolean`             | Stop this item from opening or closing.        |

## Explorer

Click a part name to highlight it in the preview.
