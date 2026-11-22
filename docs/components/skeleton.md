# Skeleton

A gray placeholder in the shape of content that is still loading.

```tsx
import { Skeleton, SkeletonCircle, SkeletonText } from '@leverui/components';
```

```tsx
<Stack gap="6" style={{ 'max-width': 'var(--leverui-sizes-xs)' }}>
  <HStack style={{ width: '100%' }}>
    <SkeletonCircle size="10" />
    <SkeletonText noOfLines={2} />
  </HStack>
  <Skeleton style={{ height: '200px' }} />
</Stack>
```

## Guides

`Skeleton` keeps its children mounted but hidden until `loading` is false.
`SkeletonCircle` is a round placeholder. `SkeletonText` shows lines in place of
text.

### Loading and composition

Keep the content inside `Skeleton` so the placeholder takes up the same space.
When `loading` becomes false, the children fade in. No status role and nothing
announced to screen readers: add your own accessible loading message if people
need one.

`SkeletonCircle`: `size` sets both width and height. `SkeletonText`: three
lines by default; with more than one, the last is 80% wide. Inline children
stay mounted and hidden in each line, then show as one line once loaded.
`rootProps` passes native props to the element that stacks the lines. `gap`
sets the space between lines.

Pass a function to repeat your own content in every line.

```tsx
function renderTextLine() {
  return <span>Loading content</span>;
}

<SkeletonText noOfLines={3}>{renderTextLine}</SkeletonText>;
```

A JSX element is a single DOM node, so passed directly it shows in only one
line.

### Variants and motion

`variant`: `pulse` (default), `shine` (a moving gradient), or `none`. Animation
stops under reduced motion. Pass an object for a different variant per
breakpoint.

```tsx
<Skeleton variant="shine" style={{ width: '100%', height: 'var(--leverui-sizes-5)' }} />
<Skeleton variant={{ base: 'pulse', md: 'shine' }} />
```

## Props

| Prop       | Default | Type                                             | Description                                            |
| ---------- | ------- | ------------------------------------------------ | ------------------------------------------------------ |
| `loading`  | `true`  | `boolean`                                        | Show the placeholder. Set `false` to show the content. |
| `variant`  | `pulse` | `'pulse' \| 'shine' \| 'none'` or responsive map | Placeholder look and motion.                           |
| `as`       | `div`   | Native HTML tag                                  | HTML tag to render.                                    |
| `asChild`  | —       | Solid render function                            | Render your own element with the skeleton's props.     |
| `unstyled` | `false` | `boolean`                                        | Turn off the Lever UI styles.                          |

`SkeletonPropsProvider` sets default props, which can be reactive, for the
skeletons inside it. A prop on a skeleton wins. `Skeleton` also accepts native
HTML attributes, a `ref`, `class`, and `style`.

## Customize with CSS

Import `@leverui/components/styles.css` before your own stylesheet.

Classes: `.leverui-skeleton`, `.leverui-skeleton-text` (text wrapper),
`.leverui-skeleton-text__line` (each line).

Root attributes: `data-loading`, `data-variant`, plus one per breakpoint, such
as `data-variant-md`.

| Variable                             | Purpose                                  |
| ------------------------------------ | ---------------------------------------- |
| `--leverui-skeleton-bg`              | Pulse placeholder background             |
| `--leverui-skeleton-start-color`     | Shine gradient start color               |
| `--leverui-skeleton-end-color`       | Shine gradient end color                 |
| `--leverui-skeleton-duration`        | Pulse or shine animation duration        |
| `--leverui-skeleton-fade-duration`   | Fade duration when loading becomes false |
| `--leverui-skeleton-text-width`      | Width of the text stack                  |
| `--leverui-skeleton-line-height`     | Height of each loading text line         |
| `--leverui-skeleton-last-line-width` | Width of the final loading line          |

```css
.leverui-skeleton[data-brand-placeholder] {
  --leverui-skeleton-start-color: #f3c9d7;
  --leverui-skeleton-end-color: #d95f91;
}
```

To reuse a look, set the variables in a CSS class.
