# Collapsible

A section of content that the user can show or hide with a trigger.

```tsx
import { Collapsible } from '@leverui/components';
```

```tsx
<Collapsible.Root>
  <Collapsible.Trigger>
    <Collapsible.Indicator />
  </Collapsible.Trigger>
  <Collapsible.Content />
</Collapsible.Root>
```

## Guides

### Accessing collapsible context

Call `useCollapsibleContext` in any component inside the collapsible. It
returns an accessor.

```tsx
import { Collapsible, useCollapsibleContext } from '@leverui/components';

function CollapsibleStatus() {
  const collapsible = useCollapsibleContext();

  return <div>Collapsible is {collapsible().open ? 'open' : 'closed'}</div>;
}

function MyCollapsible() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>
        <CollapsibleStatus />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

### Closing programmatically

Call `setOpen(false)` on the context.

```tsx
import { Button, Collapsible, useCollapsibleContext } from '@leverui/components';

function CloseButton() {
  const collapsible = useCollapsibleContext();

  return <Button onClick={() => collapsible().setOpen(false)}>Close Collapsible</Button>;
}

function MyCollapsible() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>
        <CloseButton />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

### Content Padding

Put padding on an element inside `Collapsible.Content`, not on
`Collapsible.Content` itself. Padding on it makes the animation stutter.

**Do this:**

```tsx
<Collapsible.Root>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>
    <Box style={{ padding: '1rem', border: '1px solid' }}>{/* Content here */}</Box>
  </Collapsible.Content>
</Collapsible.Root>
```

**Not this:**

```tsx
<Collapsible.Root>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  {/* Avoid applying padding directly to Content */}
  <Collapsible.Content style={{ padding: '1rem', border: '1px solid' }}>
    {/* Content here */}
  </Collapsible.Content>
</Collapsible.Root>
```

## Props

### Root

| Prop              | Default | Type                                                          | Description                                           |
| ----------------- | ------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `as`              | `div`   | Native tag                                                    | HTML tag to render.                                   |
| `asChild`         | —       | Solid render function                                         | Render your own element with the collapsible's props. |
| `unstyled`        | —       | `boolean`                                                     | Turn off the default styles. Behavior stays.          |
| `collapsedHeight` | —       | `string \| number`                                            | Content height when collapsed.                        |
| `collapsedWidth`  | —       | `string \| number`                                            | Content width when collapsed.                         |
| `defaultOpen`     | —       | `boolean`                                                     | Start open.                                           |
| `disabled`        | —       | `boolean`                                                     | Disable the collapsible.                              |
| `ids`             | —       | `Partial<{ root: string; content: string; trigger: string }>` | Your own ids for the elements.                        |
| `lazyMount`       | `false` | `boolean`                                                     | Render the content on first open.                     |
| `onExitComplete`  | —       | `VoidFunction`                                                | Called when the closing animation finishes.           |
| `onOpenChange`    | —       | `(details: OpenChangeDetails) => void`                        | Called when the collapsible opens or closes.          |
| `open`            | —       | `boolean`                                                     | Open state, when you control it.                      |
| `unmountOnExit`   | `false` | `boolean`                                                     | Remove the content when the collapsible closes.       |

Give the trigger a visible name that says what it opens. With
`collapsedHeight`, check that controls in the cut-off preview still work.

`Collapsible.RootProvider`, `Collapsible.PropsProvider`, and the context hooks
are for building your own compositions.

## Customize with CSS

Classes: `leverui-collapsible__root`, `leverui-collapsible__trigger`,
`leverui-collapsible__content`, `leverui-collapsible__indicator`. State is on
the `data-state` attributes. `unstyled` keeps the behavior and the
accessibility features.

## Explorer

Click a part name to highlight it in the preview.
