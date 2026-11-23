# Status

A small colored dot with a label that shows a state, such as online or failed.

```tsx
import { Status } from '@leverui/components';
```

```tsx
<Status.Root>
  <Status.Indicator />
</Status.Root>
```

For one component with props, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { omit } from 'solid-js';
import { Status as LeverUIStatus, type StatusRootProps } from '@leverui/components';

type StatusValue = 'success' | 'error' | 'warning' | 'info';

export type StatusProps = StatusRootProps & {
  value?: StatusValue | undefined;
};

const statusMap: Record<StatusValue, string> = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
};

export function Status(props: StatusProps) {
  const root = omit(props, 'children', 'value');

  return (
    <LeverUIStatus.Root
      {...root}
      colorPalette={root.colorPalette ?? statusMap[props.value ?? 'info']}
    >
      <LeverUIStatus.Indicator />
      {props.children}
    </LeverUIStatus.Root>
  );
}
```

## Guides

### Semantics

`Status` renders a `div` for the root and a `div` for the indicator. The root
has no ARIA role. Add a `role` when your app needs one.

### Reactive provider defaults

`StatusPropsProvider` sets default props for the roots inside it. A prop on a
root wins. For defaults that depend on a signal, pass a function that returns
them. Roots already on the page update in place.

```tsx
import { createSignal } from 'solid-js';
import { Status, StatusPropsProvider, type StatusRootBaseProps } from '@leverui/components';

export function LiveStatus() {
  const [ready, setReady] = createSignal(false);

  function readDefaults(): StatusRootBaseProps {
    return { colorPalette: ready() ? 'green' : 'orange' };
  }

  function toggleReady() {
    setReady(!ready());
  }

  return (
    <>
      <StatusPropsProvider value={readDefaults}>
        <Status.Root>
          <Status.Indicator />
          {ready() ? 'Ready' : 'Processing'}
        </Status.Root>
      </StatusPropsProvider>
      <button type="button" onClick={toggleReady}>
        Toggle status
      </button>
    </>
  );
}
```

### Custom indicators

Put the indicator class on your own `div` to give it the root's palette color
and the indicator's size.

```tsx
<Status.Root colorPalette="blue">
  <div class="leverui-status__indicator" />
  Processing
</Status.Root>
```

## Props

| Prop           | Default | Type                                                                                                     | Description                                    |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `colorPalette` | `gray`  | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                 |
| `size`         | `md`    | `'sm' \| 'md' \| 'lg'` or responsive map                                                                 | Status size.                                   |
| `as`           | `div`   | Native HTML tag                                                                                          | HTML tag to render.                            |
| `asChild`      | —       | Solid render function                                                                                    | Render your own element with the root's props. |
| `unstyled`     | `false` | `boolean`                                                                                                | Turn off the Lever UI styles.                  |

Also takes `class`, `style`, standard HTML attributes, and a callback `ref`.

## Customize with CSS

Import `@leverui/components/styles.css`, then style `.leverui-status__root` and
`.leverui-status__indicator`. These class names will not change.

Root attributes: `data-size`, `data-size-sm` through `data-size-2xl` for sizes
set per screen size, and `data-leverui-color-palette`. Override the
`--lui-*` variables for a whole theme or for one Status root.

```css
.leverui-status__indicator {
  box-shadow: 0 0 0 2px currentColor;
}
```

## Explorer

Click a part name to highlight it in the preview.
