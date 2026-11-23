# Tag

A small label for a keyword or a choice, which the user can often remove.

```tsx
import { Tag } from '@leverui/components';
```

```tsx
<Tag.Root>
  <Tag.Label>Tag here</Tag.Label>
</Tag.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Tag, type TagRootProps } from '@leverui/components';

export type ClosedTagProps = TagRootProps & {
  startElement?: JSX.Element;
  endElement?: JSX.Element;
  onClose?: () => void;
  closable?: boolean;
};

export function ClosedTag(props: ClosedTagProps) {
  const root = omit(props, 'startElement', 'endElement', 'onClose', 'closable', 'children');

  return (
    <Tag.Root {...root}>
      <Show when={props.startElement}>
        <Tag.StartElement>{props.startElement}</Tag.StartElement>
      </Show>
      <Tag.Label>{props.children}</Tag.Label>
      <Show when={props.endElement}>
        <Tag.EndElement>{props.endElement}</Tag.EndElement>
      </Show>
      <Show when={props.closable ?? Boolean(props.onClose)}>
        <Tag.EndElement>
          <Tag.CloseTrigger onClick={() => props.onClose?.()} />
        </Tag.EndElement>
      </Show>
    </Tag.Root>
  );
}
```

## Props

### Root

| Prop           | Default   | Type                                                                                                     | Description                                   |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `colorPalette` | `gray`    | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                |
| `size`         | `md`      | `'sm' \| 'md' \| 'lg' \| 'xl'`                                                                           | Tag size. Responsive.                         |
| `variant`      | `surface` | `'subtle' \| 'solid' \| 'outline' \| 'surface'`                                                          | Tag style. Responsive.                        |
| `as`           | `div`     | Native HTML tag                                                                                          | HTML tag to render.                           |
| `asChild`      | —         | Solid render function                                                                                    | Render your own element with the tag's props. |
| `unstyled`     | `false`   | `boolean`                                                                                                | Turn off the Lever UI styles.                 |

The root is a native `div` with no ARIA role. The label and the start and end
elements are `span` elements. The label stays on one line. For long text, limit
the root's width with `style`.

`Tag.CloseTrigger` is a native `type="button"` with a decorative close icon.
Screen readers announce it as `Close`. Pass a more specific `aria-label` when
the user needs to know what closes. It does not remove the tag, so do that in
`onClick`.

With `asChild`, spread `getProps()` on your element to keep the Tag styles,
attributes, and events. `Tag.RootPropsProvider` takes its defaults as an object
or a Solid accessor. Use an accessor when they depend on signals. A prop on a
tag wins.

## Customize with CSS

Import `@leverui/components/styles.css`, then style `.lui-tag__root`,
`.lui-tag__label`, `.lui-tag__startElement`,
`.lui-tag__endElement`, and `.lui-tag__closeTrigger`. The class names
do not change.

The root has attributes for its size, variant, and palette. Responsive values
add `data-size-sm` through `data-size-2xl` and `data-variant-sm` through
`data-variant-2xl`. Override the `--lui-*` variables on a theme scope or on
a single Tag.

```css
.lui-tag__label {
  letter-spacing: 0.01em;
}
```

A part's class gives your own element that part's default styles.
`<span class="lui-tag__label">Custom</span>` inside `Tag.Root` follows the
root's current size.

## Explorer

Click a part name to highlight it in the preview.
