# Avatar

A small picture of a person, with their initials or an icon when there is no
image.

```tsx
import { Avatar, AvatarGroup } from '@leverui/components';
```

```tsx
<AvatarGroup>
  <Avatar.Root>
    <Avatar.Fallback />
    <Avatar.Image />
  </Avatar.Root>
</AvatarGroup>
```

For one component with props, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Avatar as AvatarParts, type AvatarRootProps } from '@leverui/components';

export type ClosedAvatarProps = AvatarRootProps & {
  name?: string | undefined;
  src?: string | undefined;
  srcSet?: string | undefined;
  loading?: 'eager' | 'lazy' | undefined;
  icon?: JSX.Element;
  fallback?: JSX.Element;
};

export function ClosedAvatar(props: ClosedAvatarProps) {
  const root = omit(props, 'name', 'src', 'srcSet', 'loading', 'icon', 'fallback', 'children');

  return (
    <AvatarParts.Root {...root}>
      <AvatarParts.Fallback name={props.name}>{props.fallback ?? props.icon}</AvatarParts.Fallback>
      <AvatarParts.Image src={props.src} srcset={props.srcSet} loading={props.loading} />
      {props.children}
    </AvatarParts.Root>
  );
}
```

Group them with `AvatarGroup` from `@leverui/components`.

## Props

### Root

| Prop             | Default  | Type                                                               | Description                                     |
| ---------------- | -------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `colorPalette`   | `gray`   | `string`                                                           | Color palette, built-in or your own.            |
| `size`           | `md`     | `'full' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | Avatar size. Responsive.                        |
| `variant`        | `subtle` | `'solid' \| 'subtle' \| 'outline'`                                 | Avatar style. Responsive.                       |
| `shape`          | `full`   | `'square' \| 'rounded' \| 'full'`                                  | Corner shape. Responsive.                       |
| `as`             | `div`    | Native HTML tag                                                    | HTML tag to render.                             |
| `asChild`        | —        | Solid render function                                              | Render your own element with this part's props. |
| `unstyled`       | `false`  | `boolean`                                                          | Turn off the Lever UI styles.                   |
| `ids`            | —        | Element ID map                                                     | Your own IDs for the root, image, and fallback. |
| `onStatusChange` | —        | `(details) => void`                                                | Called when the image loading status changes.   |
| `borderless`     | —        | `boolean`                                                          | Remove the border the avatar gets in a group.   |

### Fallback

| Prop      | Default | Type                  | Description                                                    |
| --------- | ------- | --------------------- | -------------------------------------------------------------- |
| `name`    | —       | `string`              | Name the initials come from. Without it, shows a generic icon. |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                                            |
| `asChild` | —       | Solid render function | Render your own element with this part's props.                |

### Image

| Prop      | Default | Type                  | Description                                     |
| --------- | ------- | --------------------- | ----------------------------------------------- |
| `as`      | `img`   | Native HTML tag       | HTML tag to render.                             |
| `asChild` | —       | Solid render function | Render your own element with this part's props. |

Make the image `alt` and the fallback name match the person or thing shown.
Leave `alt` empty only when text next to the avatar already names it.

`AvatarGroup` overlaps its avatars. Set `--lui-avatar-group-overlap` on
the group to change the overlap.

## Customize with CSS

Give the root or a part a `class`. Load your CSS after the Lever UI stylesheet.

Classes: `.leverui-avatar__root`, `.leverui-avatar__image`,
`.leverui-avatar__fallback`, `.leverui-avatar__icon`, `.leverui-avatar-group`.

```css
.profile-avatar {
  --lui-colors-color-palette-muted: #dbeafe;
}

.profile-avatar .leverui-avatar__fallback {
  letter-spacing: 0.04em;
}
```

## Explorer

Click a part name to highlight it in the preview.
