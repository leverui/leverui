# For

Renders one item for each entry in a list, and a fallback when the list is
empty.

```tsx
import { For } from '@leverui/components';
```

```tsx
<For each={[]} fallback={...} />
```

## Guides

Adds no wrapper element and no styles. Items that stay in the list stay
mounted. The index is an accessor: call it to read the item's position in the
original array.

`each={undefined}` renders nothing. Empty slots in a sparse array are skipped,
and the other items keep their original index. `For` is not announced as a
list, so use `ul`, `ol`, and `li` when it is one.

## Props

| Prop       | Default | Type                                                | Description                                         |
| ---------- | ------- | --------------------------------------------------- | --------------------------------------------------- |
| `each`     | —       | `T[] \| readonly T[] \| undefined`                  | Array to loop over.                                 |
| `fallback` | —       | `JSX.Element \| undefined`                          | Shown when the array is empty.                      |
| `children` | —       | `(item: T, index: Accessor<number>) => JSX.Element` | Renders one item. Gets the item and index accessor. |
