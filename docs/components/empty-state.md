# Empty State

Shown in place of content when there is nothing to display yet, with a hint
about what to do next.

```tsx
import { EmptyState } from '@leverui/components';
```

```tsx
<EmptyState.Root>
  <EmptyState.Content>
    <EmptyState.Indicator />
    <EmptyState.Title />
    <EmptyState.Description />
  </EmptyState.Content>
</EmptyState.Root>
```

For one component that takes props, see the
[snippet below](#closed-component).

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { EmptyState, VStack, type EmptyStateRootProps } from '@leverui/components';

export type ClosedEmptyStateProps = EmptyStateRootProps & {
  title: string;
  description?: string | undefined;
  icon?: JSX.Element;
};

export function ClosedEmptyState(props: ClosedEmptyStateProps) {
  const root = omit(props, 'title', 'description', 'icon', 'children');

  return (
    <EmptyState.Root {...root}>
      <EmptyState.Content>
        <Show when={props.icon}>
          <EmptyState.Indicator>{props.icon}</EmptyState.Indicator>
        </Show>
        <Show
          when={props.description}
          fallback={<EmptyState.Title>{props.title}</EmptyState.Title>}
        >
          <VStack style={{ 'text-align': 'center' }}>
            <EmptyState.Title>{props.title}</EmptyState.Title>
            <EmptyState.Description>{props.description}</EmptyState.Description>
          </VStack>
        </Show>
        {props.children}
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
```

```tsx
<ClosedEmptyState title="Nothing in your cart yet" description="Add a product to get started" />
```

## Guides

### Structure

`Root`, `Content`, and `Indicator` render a `div`, `Title` an `h3`, and
`Description` a `p`. Put every part inside `Root` so it picks up the size.

`EmptyState` also exports each part by its full name.
`EmptyStatePropsProvider` sets a default size, which can be reactive. A prop on
a root wins.

### Responsive size

`size` sets the root padding, the content gap, the indicator size, and the
title size. It takes a value per screen size or a Solid signal.

The root sets `data-size`, plus `data-size-*` for values set per screen size.

```tsx
<EmptyState.Root size={{ base: 'sm', md: 'lg' }}>
  <EmptyState.Content>
    <EmptyState.Title>No saved items</EmptyState.Title>
  </EmptyState.Content>
</EmptyState.Root>
```

### Accessibility

No status role by default, so screen readers do not announce it. Set
`role="status"` on `Root` when it appears after a search or a loading step and
should be announced politely.

Keep action buttons inside `Content`. Mark a decorative indicator
`aria-hidden="true"`. The title and description should make sense without the
picture.

## Props

### Root

| Prop       | Default | Type                   | Description                                    |
| ---------- | ------- | ---------------------- | ---------------------------------------------- |
| `size`     | `'md'`  | `'sm' \| 'md' \| 'lg'` | Empty state size.                              |
| `as`       | `div`   | Native tag             | HTML tag to render.                            |
| `asChild`  | —       | Solid render function  | Render your own element with the root's props. |
| `unstyled` | —       | `boolean`              | Turn off the Lever UI styles.                  |

## Customize with CSS

Import `@leverui/components/styles.css` before your own CSS.

Variables, for a whole theme or one root:
`--lui-empty-state-padding-inline`, `--lui-empty-state-padding-block`,
`--lui-empty-state-gap`, `--lui-empty-state-indicator-size`,
`--lui-empty-state-title-size`.

Classes: `.lui-empty-state__*`, one per part. Example:
`.my-empty-state .lui-empty-state__title { color: navy; }`.

Every part takes `class`, `style`, `unstyled`, HTML attributes, refs, `as`, and
`asChild`.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
