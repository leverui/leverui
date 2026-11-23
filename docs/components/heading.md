# Heading

A title for a page or a section.

```tsx
import { Heading } from '@leverui/components';
```

```tsx
<Heading>Account settings</Heading>
```

## Guides

### Semantic levels

Renders an `h2` by default. `size` changes the look, not the heading level.
Set `as="h1"` through `as="h6"` to fit your page structure. Native attributes
and the ref go to that element. With `asChild`, your element keeps its own
meaning, so use a real heading tag for a heading.

### Responsive sizes

Pass an object keyed by breakpoint name, or an array of sizes in breakpoint
order. Lever UI adds `data-size-sm`, `data-size-md`, `data-size-lg`,
`data-size-xl`, and `data-size-2xl` for the breakpoints you set. The stylesheet
applies them at 480, 768, 1024, 1280, and 1536 pixels.

```tsx
<Heading size={{ base: 'lg', md: '2xl', xl: '4xl' }}>Responsive title</Heading>
```

Without `base`, the heading inherits its font size below the first breakpoint
you set. Large sizes set a letter spacing, and a smaller size at a later
breakpoint does not remove it. Set your own in CSS if you need to.

### Shared defaults

`HeadingPropsProvider` sets default props for the headings inside it. A prop
on a heading wins.

```tsx
import { Heading, HeadingPropsProvider } from '@leverui/components';

<HeadingPropsProvider value={{ size: '2xl' }}>
  <Heading>Uses the provider size</Heading>
  <Heading size="sm">Keeps its own size</Heading>
</HeadingPropsProvider>;
```

## Customization

Your plain CSS overrides the heading styles without `!important`. Target
`.lui-heading` and the `data-size` attribute. If you override the font
size, also set the line height and the letter spacing.

### Changing default styles

```css
.lui-heading {
  font-weight: var(--lui-font-weights-normal);
  font-size: var(--lui-font-sizes-4xl);
  line-height: 2.5rem;
}
```

### Changing heading font globally

Set `--lui-fonts-heading` in your theme.

```css
:root {
  --lui-fonts-heading: 'Playfair Display', serif;
}
```

### Adding a new size

`size` takes a fixed set of values. For your own size, write a class.

```css
.heading-custom {
  font-size: 100px;
  line-height: 100px;
  letter-spacing: -2px;
}
```

```tsx
<Heading class="heading-custom">Extra large title</Heading>
```

The [CSS theme guide](../theme-guide.md) lists what you can override.

## Props

| Prop       | Default | Type                                                                                         | Description                                              |
| ---------- | ------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `size`     | `'xl'`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl' \| '6xl' \| '7xl'` | Heading text size.                                       |
| `as`       | `h2`    | Native HTML tag                                                                              | HTML tag to render.                                      |
| `asChild`  | —       | Solid render function                                                                        | Render your own element with the heading's props.        |
| `unstyled` | —       | `boolean`                                                                                    | Turn off the default styles. The element stays the same. |
