# Password Input

A password field with a button that shows or hides the password.

```tsx
import { PasswordInput, PasswordStrengthMeter } from '@leverui/components';
```

```tsx
<PasswordInput />
<PasswordStrengthMeter />
```

## Props

### Root

| Prop              | Default | Type                                    | Description                                  |
| ----------------- | ------- | --------------------------------------- | -------------------------------------------- |
| `defaultVisible`  | `false` | `boolean`                               | Show the password on first render.           |
| `visible`         | —       | `boolean`                               | Show the password, when you control it.      |
| `onVisibleChange` | —       | `(visible: boolean) => void`            | Called when the password is shown or hidden. |
| `visibilityIcon`  | —       | `{ on: JSX.Element; off: JSX.Element }` | Your own icons for the visibility button.    |
| `rootProps`       | —       | `InputGroupProps`                       | Props for the input group around the input.  |
| `ref`             | —       | `(element: HTMLInputElement) => void`   | Receives the native `<input>` element.       |

The value, HTML attributes, event handlers, and `Input` sizes pass to the
`<input>` inside. Control the value with `onInput`. The visibility button keeps
focus in the input and has `tabIndex={-1}`, so Tab skips it.

`PasswordStrengthMeter` shows four segments by default. `value` is a number
from zero to `max`, which defaults to four. Labels: Low, Medium, or High.
Selected segments: red, orange, or green. The meter does not read the password.
Score it yourself and pass the result.

## Customize with CSS

Import `styles.css` once, before your own CSS.

`PasswordInput`: `.leverui-password-input` on the group,
`.leverui-password-input__visibility-trigger` on the button, plus the
`data-visible` and `data-disabled` attributes. The button is a native
`type="button"` with the classes of a small ghost Button.

`PasswordStrengthMeter`: `.leverui-password-strength-meter` on the root, and
`__track`, `__segment`, and `__label` on the parts. The root has
`data-strength-level="low" | "medium" | "high"`. Selected segments have
`data-selected`.

Variables, for one meter or a whole theme:
`--lui-password-strength-selected-background`,
`--lui-password-strength-unselected-background`,
`--lui-password-strength-segment-height`,
`--lui-password-strength-segment-radius`,
`--lui-password-strength-label-font-size`,
`--lui-password-strength-label-line-height`.

`class` and `style` also work.
