# Composition

## The `as` Prop

Changes the HTML element a component renders. The component keeps its behavior.

```tsx
<Heading as="h3">Hello, world!</Heading>
```

> **TypeScript:** `as` accepts native element names only. A Solid component is
> a type error. Native attributes follow the tag: `<Box as="a" href="/docs" />`
> compiles, `href` on an `h2` does not. Use `asChild` to render your own
> component.

## The `asChild` Prop

Puts a component's behavior on an element you render. `asChild` is a Solid
render function, not a boolean. It receives `getProps`, which returns the
attributes, events, ARIA state, and `ref` to place on your element.

```tsx
import { Button, Popover, Portal } from '@leverui/components';
import type { JSX } from '@solidjs/web';

/** Use a styled Button as the popover's trigger element. */
export function PopoverWithButtonTrigger(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger asChild={(getProps) => <Button {...getProps()}>Open</Button>} />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>Popover content</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
```

Only one element renders. The trigger's state and handlers land on the `Button`.

Pass your own class, style, event, or `ref` to `getProps` to merge it with the
component's. Your event handlers run first.

```tsx
import { Button } from '@leverui/components';
import type { JSX } from '@solidjs/web';

/** Render the Button's behavior and classes on a navigation link. */
export function ButtonLink(): JSX.Element {
  return (
    <Button
      asChild={(getProps) => (
        <a {...getProps({ class: 'nav-link' })} href="/docs">
          Read the docs
        </a>
      )}
    />
  );
}
```

## The `render` Prop

Draws a part as your own element, with the part's state at hand. `render`
receives a props function and a state accessor. Spread the props onto your
element, and read the state to change what you draw.

```tsx
<Accordion.Item
  value="a"
  render={(props, state) => <section {...props()} data-open={String(state().expanded)} />}
>
  …
</Accordion.Item>
```

Use one of `as`, `asChild`, or `render` on a part. `state` is typed `unknown`,
so narrow it before reading a field. A wrapper type that leaves out the
composition props leaves out `render` too:
`Omit<SwitchRootProps<'label'>, 'as' | 'asChild' | 'render'>`.

## Best Practices

- **Pass Refs Through:** Solid has no `forwardRef`. A `ref` arrives in `props`,
  so spreading props onto the element forwards it.
- **Spread Props:** Spread the props you receive. Attributes left out of the
  spread lose their behavior.
- **Keep Props Reactive:** Do not destructure `props`. Use `{...props}` or
  `omit` so ARIA and state attributes keep updating.
- **Recheck The Element:** If `as` or `asChild` changes the element, recheck
  its role, name, keyboard behavior, and disabled behavior.

```tsx
import { Box, Button, type BoxProps } from '@leverui/components';
import type { ComponentProps, JSX } from 'solid-js';

/** Forward every attribute and the ref to a Box. */
function MyBox(props: BoxProps<'button'>): JSX.Element {
  return <Box {...props} />;
}

/** Forward every attribute and the ref to a native button. */
function MyButton(props: ComponentProps<'button'>): JSX.Element {
  return <button {...props} />;
}

/** Show both composition styles against components that forward props. */
export function CompositionExamples(): JSX.Element {
  return (
    <>
      {/* with `as` prop */}
      <MyBox as="button">Click me</MyBox>
      {/* with `asChild` prop */}
      <Button asChild={(getProps) => <MyButton {...getProps()}>Click me</MyButton>} />
    </>
  );
}
```

What to check after changing an element:
[accessibility guide](../accessibility.md).
