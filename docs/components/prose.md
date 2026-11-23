# Prose

Styles a block of rich text, such as an article from a CMS, with readable
spacing for its headings, lists, and links.

```tsx
import { Prose } from '@leverui/components';
```

```tsx
<Prose>
  <div innerHTML="..." />
</Prose>
```

## Customize with CSS

Import `@leverui/components/styles.css` once in your app. `class="not-prose"`
leaves an element and its children out of the text styles. Target
`.leverui-prose`, or set `--lui-prose-color`, `--lui-prose-max-width`,
`--lui-prose-font-size`, and `--lui-prose-line-height` on the
component. `unstyled` turns off the default text styles.

## Trusted content

Prose does not read Markdown. Give it rendered HTML, or Solid elements from
your Markdown renderer. Pass static HTML you trust with Solid's `innerHTML`.
Never pass text you do not trust to `innerHTML`.
