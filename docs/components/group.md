# Group

Places related items side by side, and can join their edges into one control.

```tsx
import { Group } from '@leverui/components';

export function GroupUsage() {
  return (
    <Group>
      <div />
      <div />
    </Group>
  );
}
```

## Props

| Prop      | Default | Type                  | Description                                      |
| --------- | ------- | --------------------- | ------------------------------------------------ |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                              |
| `asChild` | —       | Solid render callback | Render your own element in place of the default. |

Children sit in one row by default. `orientation="vertical"` stacks them.

`attached` joins the children's edges. `grow` makes them share the available
width. `align`, `justify`, and `wrap` control the flex layout.

`stacking="first-on-top"` and `"last-on-top"` set which child sits on top where
children overlap. A `skip` function leaves a direct child out of the joined
edges and the stacking order.

Responsive: `orientation`, `attached`, `grow`, and `stacking`.

Variables: `--leverui-group-gap` for spacing, `--leverui-group-align`,
`--leverui-group-justify`, and `--leverui-group-wrap`.

Layout only. `Group` adds no shared keyboard or selection behavior, so give
each control its own accessible name and behavior.
