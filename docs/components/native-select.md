# Select (Native)

A styled version of the browser's own select menu.

```tsx
import { NativeSelect } from '@leverui/components';
```

```tsx
<NativeSelect.Root>
  <NativeSelect.Field>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </NativeSelect.Field>
  <NativeSelect.Indicator />
</NativeSelect.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Ref

```tsx
import { NativeSelect } from '@leverui/components';

export function Demo() {
  let ref: HTMLSelectElement | undefined;

  return (
    <NativeSelect.Root>
      <NativeSelect.Field ref={ref}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
```

## Closed Component

```tsx
import { For, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import {
  NativeSelect as Select,
  type NativeSelectFieldProps,
  type NativeSelectRootProps,
} from '@leverui/components';

type FieldProp = 'name' | 'value' | 'onChange' | 'defaultValue';

type RootProps = Extract<NativeSelectRootProps, { as?: never; asChild?: never }>;
type FieldProps = Extract<NativeSelectFieldProps, { as?: never; asChild?: never }>;

export type NativeSelectProps = Omit<RootProps, FieldProp> &
  Pick<FieldProps, FieldProp> & {
    icon?: JSX.Element | undefined;
    ref?: ((element: HTMLSelectElement) => void) | undefined;
    items: readonly { label: string; value: string; disabled?: boolean | undefined }[];
  };

export function NativeSelect(props: NativeSelectProps) {
  const root = omit(
    props,
    'icon',
    'children',
    'name',
    'items',
    'value',
    'defaultValue',
    'onChange',
    'ref',
  );

  return (
    <Select.Root {...root}>
      <Select.Field
        ref={props.ref}
        name={props.name}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
      >
        {props.children}
        <For each={props.items}>
          {(item) => (
            <option value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          )}
        </For>
      </Select.Field>
      <Select.Indicator>{props.icon}</Select.Indicator>
    </Select.Root>
  );
}
```

## Props

### Root

| Prop       | Default   | Type                                          | Description                                    |
| ---------- | --------- | --------------------------------------------- | ---------------------------------------------- |
| `variant`  | `outline` | `'outline' \| 'subtle' \| 'plain' \| 'ghost'` | Select style.                                  |
| `size`     | `md`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`        | Select size.                                   |
| `disabled` | —         | `boolean \| undefined`                        | Disable the select.                            |
| `invalid`  | —         | `boolean \| undefined`                        | Mark the select as invalid.                    |
| `as`       | `div`     | Native tag                                    | HTML tag to render.                            |
| `asChild`  | —         | Solid render function                         | Render your own element with the root's props. |
| `unstyled` | —         | `boolean`                                     | Turn off the component's styles.               |

`NativeSelect.Field` takes the standard `select` attributes, a ref, and an
optional `placeholder`. The placeholder becomes the first option, with an empty
value. `size` goes on the root only, not the field.

Pass children to `NativeSelect.Indicator` to replace the default chevron.

To control the selection, pass `value` from a Solid signal. For the starting
selection only, pass `defaultValue`. A form reset goes back to it. For a
`multiple` select, `defaultValue` takes an array of option values.

Inside a `Field.Root`, the field sets the disabled and invalid state and wins
over the matching props on the root. It also supplies the label, the required
state, and the text that describes the error. Without one, set `disabled` and
`invalid` on `NativeSelect.Root`.

`NativeSelect.PropsProvider` sets default props for the roots inside it. The
defaults can change over time. A prop on a root wins.

## Customize with CSS

Import `@leverui/components/styles.css` once, then override the tokens or the
part classes in your own stylesheet.

```css
.lui-native-select__field {
  border-color: rebeccapurple;
}
```

Classes: `.lui-native-select__root`, `.lui-native-select__field`, and
`.lui-native-select__indicator`.

`unstyled` on the root or on a single part turns off its default styles. The
native behavior, the classes, and the native `select` stay.

Inside an `InputGroup`, the group sets the padding of `NativeSelect.Field` to
make room for the element before or after it, at every supported breakpoint.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
