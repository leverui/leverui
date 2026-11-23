# Alert

A message that tells the user something important, such as an error, a warning,
or a success.

```tsx
import { Alert } from '@leverui/components';
```

```tsx
<Alert.Root>
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title />
    <Alert.Description />
  </Alert.Content>
</Alert.Root>
```

For a single component, see the [snippet below](#closed-component).

## Closed Component

One component that wraps the parts and takes props.

```tsx
import { omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Alert, type AlertRootBaseProps } from '@leverui/components';

type ClosedAlertProps = AlertRootBaseProps &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
    title?: JSX.Element;
    children?: JSX.Element;
    icon?: JSX.Element;
    startElement?: JSX.Element;
    endElement?: JSX.Element;
  };

export function ClosedAlert(props: ClosedAlertProps) {
  const root = omit(props, 'title', 'children', 'icon', 'startElement', 'endElement');

  return (
    <Alert.Root {...root}>
      {props.startElement ?? <Alert.Indicator>{props.icon}</Alert.Indicator>}
      {props.children ? (
        <Alert.Content>
          <Alert.Title>{props.title}</Alert.Title>
          <Alert.Description>{props.children}</Alert.Description>
        </Alert.Content>
      ) : (
        <Alert.Title style={{ flex: '1' }}>{props.title}</Alert.Title>
      )}
      {props.endElement}
    </Alert.Root>
  );
}
```

Takes the alert's appearance props and any native `div` attribute. Import the
Lever UI stylesheet once in your app.

Style the parts with CSS classes or `--lui-*` variables.

## Props

### Root

| Prop           | Default              | Type                                                                            | Description                                     |
| -------------- | -------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| `colorPalette` | Inferred from status | `string`                                                                        | Color palette. Replaces the one from `status`.  |
| `status`       | `'info'`             | `'info' \| 'warning' \| 'success' \| 'error' \| 'neutral'` or responsive values | Kind of alert. Sets the default icon.           |
| `variant`      | `'subtle'`           | `'subtle' \| 'surface' \| 'outline' \| 'solid'` or responsive values            | Alert style.                                    |
| `size`         | `'md'`               | `'sm' \| 'md' \| 'lg'` or responsive values                                     | Alert size. Changes spacing and text size.      |
| `inline`       | `false`              | `boolean` or responsive values                                                  | Put the title and description on one row.       |
| `as`           | `'div'`              | Native element tag                                                              | HTML tag to render.                             |
| `asChild`      | —                    | Solid render callback                                                           | Render your own element with the alert's props. |
| `unstyled`     | `false`              | `boolean`                                                                       | Turn off the Lever UI styles.                   |

No ARIA role by default. Add `role="alert"` for an urgent message, or
`role="status"` for one that can wait.

`Alert.PropsProvider` sets a default look for the alerts inside it. The
defaults are reactive.

Class names on the root and the parts are stable.

## Explorer

Hover over a part name to highlight it. Click to keep it selected.
