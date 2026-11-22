# Accessibility with Lever UI

Your app supplies names, instructions, validation messages, focus flow, and
contrast. Parts and props: [Button](components/button.md),
[Field](components/field.md), [Input](components/input.md).

## Name controls and describe errors

Wrap an `Input` in `Field` to link its label, helper text, error text, and
state. Give each field an `id` that is unique on the page. `Field.ErrorText`
shows when `invalid` is true.

```tsx
import { createSignal, type JSX } from 'solid-js';
import { Button, Field, Input } from '@leverui/components';

/** Keep validation state reactive so the field and message change together. */
function EmailField(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Reveal the error after the user requests validation. */
  function validate(): void {
    setInvalid(true);
  }

  return (
    <>
      <Field.Root id="email" required invalid={invalid()}>
        <Field.Label>Email</Field.Label>
        <Input type="email" defaultValue="draft" />
        <Field.HelperText>Use an address we can reach.</Field.HelperText>
        <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
      </Field.Root>
      <Button type="button" onClick={validate}>
        Check email
      </Button>
    </>
  );
}
```

- Replace `validate` with your own validation. Clear the error when the value
  becomes valid.
- Test `label[for]`, the input `id`, and `aria-describedby`, not only the
  visible message.
- An `Input` with no visible label needs a name, such as `aria-label`.
- Disabled, read-only, optional, and multi-control layouts:
  [Field guide](components/field.md).

## Keep native semantics

- Use `Button` for an action. It renders a native button with
  `type="button"`. Set `type="submit"` to submit a form. `loading` and
  `disabled` block activation. Button does not set `aria-busy`; set it on the
  region being updated.
- Give an `IconButton` an `aria-label` for its action. `CloseButton` defaults
  to a Close label. Replace it when the context needs a more specific name.
- Use a link with `href` for navigation. A Button with `as="a"` keeps link
  semantics.
- Keep the names and descriptions of compound controls. Put `Dialog.Title` and
  `Dialog.Description` inside an open dialog. Keep its trigger and close
  control keyboard reachable.

## Focus, keyboard, and portals

- Composition can change keyboard and focus behavior. Test tab order, Enter
  and Space, Escape where supported, and focus return after an overlay closes.
- Overlay in a portal: keep the trigger, title, and content in the same
  component context.
- `asChild`: apply the supplied props to the native element in its render
  function.
- Do not replace a native control with a styled `div`.
- If `as` or `asChild` changes the element, recheck role, name, keyboard, ref,
  and disabled behavior.

## Check appearance and interaction together

- After overriding `--leverui-*` colors, check text and control contrast, focus
  indicators, disabled states, and light and dark scopes. See the
  [theme guide](theme-guide.md).
- Respect reduced-motion preferences in motion you add.
- Smoke check: find controls by role and name, inspect label and description
  links, use the keyboard, and run an automated scan. A scan alone does not
  prove focus order or clear validation.
- Hydration checks: [server rendering](server-rendering.md).
