# Button

Triggers an action or event.

```tsx
import { Button, ButtonGroup } from '@leverui/components';
```

```tsx
<Button>Click me</Button>
```

## Ref

`ref` gives you the real `button` element.

```tsx
import { onSettled } from 'solid-js';
import { Button } from '@leverui/components';

export function Demo() {
  let button: HTMLButtonElement | undefined;

  onSettled(() => button?.focus());

  return (
    <Button
      ref={(element) => {
        button = element;
      }}
    >
      Click me
    </Button>
  );
}
```

## Customization

Style with plain CSS and the `--lui-*` variables. Load your CSS after
`@leverui/components/styles.css`.

### Adding a new variant

Give the button a class and style it. The `variant` prop accepts only the six
built-in variants.

```css
.action-pill.leverui-button {
  border-radius: 9999px;
  padding-inline: 1.5rem;
  background: var(--lui-colors-blue-solid);
  color: var(--lui-colors-blue-contrast);
}
```

```tsx
import { Button } from '@leverui/components';

export function Demo() {
  return <Button class="action-pill">Pill Button</Button>;
}
```

### Adding a new size

Give the button a class and set the size in CSS.

```css
.action-xxl.leverui-button {
  min-height: 4rem;
  min-width: 4rem;
  padding-inline: 2rem;
  font-size: 1.25rem;
}
```

### Changing the default size

`ButtonPropsProvider` sets the default size for the buttons inside it. A `size`
on a button wins.

```tsx
import { Button, ButtonPropsProvider } from '@leverui/components';

export function Demo() {
  return (
    <ButtonPropsProvider value={{ size: 'lg' }}>
      <Button>Large by default</Button>
    </ButtonPropsProvider>
  );
}
```

### Changing the default variant

```tsx
import { Button, ButtonPropsProvider } from '@leverui/components';

export function Demo() {
  return (
    <ButtonPropsProvider value={{ variant: 'outline' }}>
      <Button>Outline by default</Button>
    </ButtonPropsProvider>
  );
}
```

## Props

| Prop               | Default    | Type                                                                                        |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------- |
| `spinnerPlacement` | `'start'`  | `'start' \| 'end'`                                                                          |
| `colorPalette`     | `'gray'`   | Palette name                                                                                |
| `size`             | `'md'`     | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` or responsive choices              |
| `variant`          | `'solid'`  | `'solid' \| 'subtle' \| 'surface' \| 'outline' \| 'ghost' \| 'plain'` or responsive choices |
| `loading`          | `false`    | `boolean`                                                                                   |
| `loadingText`      | —          | `JSX.Element`                                                                               |
| `spinner`          | —          | `JSX.Element`                                                                               |
| `as`               | `'button'` | Native element tag                                                                          |
| `asChild`          | —          | Solid render callback                                                                       |

Other HTML attributes go to the rendered tag. `asChild` takes a Solid function
that returns your own element.
