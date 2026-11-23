# Blockquote

Sets off a quotation from the text around it, with an optional source.

```tsx
import { Blockquote } from '@leverui/components';
```

```tsx
<Blockquote.Root>
  <Blockquote.Content cite="https://" />
  <Blockquote.Caption>
    <cite>Wren Ashford</cite>
  </Blockquote.Caption>
</Blockquote.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Blockquote, type BlockquoteRootProps } from '@leverui/components';

export type ClosedBlockquoteProps = BlockquoteRootProps & {
  cite?: JSX.Element;
  citeUrl?: string | undefined;
  icon?: JSX.Element;
  showDash?: boolean | undefined;
};

export function ClosedBlockquote(props: ClosedBlockquoteProps) {
  const root = omit(props, 'children', 'cite', 'citeUrl', 'icon', 'showDash');

  return (
    <Blockquote.Root {...root}>
      {props.icon}
      <Blockquote.Content cite={props.citeUrl}>{props.children}</Blockquote.Content>
      <Show when={props.cite}>
        <Blockquote.Caption>
          {props.showDash ? '— ' : ''}
          <cite>{props.cite}</cite>
        </Blockquote.Caption>
      </Show>
    </Blockquote.Root>
  );
}
```

## Props

### Root

| Prop           | Default  | Type                             | Description                                          |
| -------------- | -------- | -------------------------------- | ---------------------------------------------------- |
| `colorPalette` | `gray`   | `string`                         | Color palette, built-in or your own.                 |
| `justify`      | `start`  | `'start' \| 'center' \| 'end'`   | Quote alignment. Responsive.                         |
| `variant`      | `subtle` | `'subtle' \| 'solid' \| 'plain'` | Blockquote style. Responsive.                        |
| `as`           | `figure` | Native HTML tag                  | HTML tag to render.                                  |
| `asChild`      | —        | Solid render function            | Render your own element with the blockquote's props. |
| `unstyled`     | `false`  | `boolean`                        | Turn off the Lever UI styles.                        |

`Blockquote.Root` renders a `figure`, `Content` a `blockquote`, and `Caption` a
`figcaption`.

`Blockquote.PropsProvider` sets default props for the blockquotes inside it. A
prop on a blockquote wins.

## Customize with CSS

Stable classes: `.lui-blockquote__root`, `__content`, `__caption`,
`__icon`. Root attributes: `data-variant`, `data-justify`,
`data-lui-color-palette`.

```css
.article-quote {
  --lui-colors-color-palette-solid: rebeccapurple;
}

.article-quote .lui-blockquote__caption {
  color: rebeccapurple;
}
```

## Explorer

Click a part name to highlight it in the preview.
