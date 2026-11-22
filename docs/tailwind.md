# Tailwind CSS

Use Tailwind 4 classes on Lever UI components and their parts. Name the cascade
layers before both imports, with `leverui` between Tailwind's `base` and
`components` layers.

```css
@layer theme, base, leverui, components, utilities;

@import 'tailwindcss';
@import '@leverui/components/styles.css';
```

Lever UI puts all of its rules in layers inside `leverui`. With this order:

- Tailwind's base styles come first, so they do not remove component padding,
  borders, or backgrounds.
- Lever UI comes before Tailwind's utilities, so a class on a component takes
  precedence over the component's own styles.

## Add classes

Pass Tailwind classes with `class`, on a component or on any of its parts.

```tsx
import { Button, Card } from '@leverui/components';

<Card.Root class="shadow-lg">
  <Card.Body class="flex flex-col gap-4">
    <Button class="rounded-full bg-emerald-600 px-8 hover:bg-emerald-700">Save</Button>
  </Card.Body>
</Card.Root>;
```

Use props for documented sizes, variants, and color palettes, and classes for
everything else.

## Import order

Without the `@layer` line, the import order decides which styles win, and both
orders break something.

| Order               | Result                                                       |
| ------------------- | ------------------------------------------------------------ |
| Lever UI first      | Tailwind's base styles remove component padding and borders. |
| Tailwind first      | Component styles override Tailwind classes on components.    |
| With the layer line | Components keep their styles, and Tailwind classes apply.    |
