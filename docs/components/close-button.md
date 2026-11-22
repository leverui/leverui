# Close Button

A small button with an X icon that closes a dialog, a drawer, or a message.

```tsx
import { CloseButton } from '@leverui/components';
```

```tsx
<CloseButton />
```

## Props

| Prop               | Default  | Type                                                                  | Description                                      |
| ------------------ | -------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| `spinnerPlacement` | `start`  | `'start' \| 'end'`                                                    | Side the spinner sits on.                        |
| `colorPalette`     | `gray`   | `string`                                                              | Color palette, built in or your own.             |
| `size`             | `md`     | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`              | Button size.                                     |
| `variant`          | `solid`  | `'solid' \| 'subtle' \| 'surface' \| 'outline' \| 'ghost' \| 'plain'` | Button style.                                    |
| `loading`          | `false`  | `boolean`                                                             | Show a loading spinner.                          |
| `loadingText`      | —        | `JSX.Element`                                                         | Text shown while loading.                        |
| `spinner`          | —        | `JSX.Element`                                                         | Spinner shown while loading.                     |
| `as`               | `button` | Native HTML tag                                                       | HTML tag to render.                              |
| `asChild`          | —        | Solid render function                                                 | Render your own element with the button's props. |

Has its own "Close" label and icon. Accepts `button` attributes and event
handlers.
