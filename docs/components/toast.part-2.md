## Props

### Toaster

| Prop       | Default         | Type                                     | Description                           |
| ---------- | --------------- | ---------------------------------------- | ------------------------------------- |
| `toaster`  | —               | `CreateToasterReturn`                    | Store returned by `createToaster`.    |
| `children` | —               | `(toast: Accessor<ToastOptions>) => JSX` | Render one toast from its store item. |
| `label`    | `Notifications` | `string`                                 | Accessible name of the toast region.  |
| `unstyled` | `false`         | `boolean`                                | Turn off the Lever UI styles.         |

### Root

| Prop       | Default | Type                  | Description                                    |
| ---------- | ------- | --------------------- | ---------------------------------------------- |
| `as`       | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild`  | —       | Solid render function | Render your own element with the part's props. |
| `unstyled` | `false` | `boolean`             | Turn off the Lever UI styles.                  |

### Title

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### Description

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |

### ActionTrigger

| Prop      | Default  | Type                  | Description                                    |
| --------- | -------- | --------------------- | ---------------------------------------------- |
| `as`      | `button` | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —        | Solid render function | Render your own element with the part's props. |

### CloseTrigger

| Prop      | Default  | Type                  | Description                                    |
| --------- | -------- | --------------------- | ---------------------------------------------- |
| `as`      | `button` | Native HTML tag       | HTML tag to render.                            |
| `asChild` | —        | Solid render function | Render your own element with the part's props. |

## Customize with CSS

Override the `.lui-toast__*` classes and the public `--lui-*`
variables. `--lui-toast-trigger-bg` and `--lui-toast-border-color`
restyle the action. For one toast, use `class` and `style`. `unstyled` turns
off the default styles. Transitions stop under reduced motion.
