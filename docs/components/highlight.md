# Highlight

Highlights the words in a text that match a search.

```tsx
import { Highlight } from '@leverui/components';
```

```tsx
<Highlight query="Hello">Hello World</Highlight>
```

## Guides

### Matching

`Highlight` adds no wrapper element. Each match is a `Mark`, a native `<mark>`
element.

A string `query` marks only its first match by default. An array marks every
match. Set `matchAll` to override either. `ignoreCase` matches upper and lower
case alike.

The child must be a string. Any other value throws an error at runtime.

### Styling matches

`markClass` adds a class to the matched `<mark>` elements only. `markStyle` is
passed to each match as its `style` attribute, for one-off values.

Default match CSS: transparent background, the color of the text around it, and
`white-space: nowrap`. It sits in a cascade layer, so your own plain CSS
overrides it.

```tsx
<Highlight query={['Solid', 'fast']} markClass="search-match">
  Solid is great and Solid is fast
</Highlight>
```

```css
.search-match {
  padding-inline: 2px;
  background-color: var(--lui-colors-orange-subtle);
  color: var(--lui-colors-orange-fg);
}
```

Matches also get the `MarkPropsProvider` defaults: variants, palettes, classes,
and native attributes. `markClass` is added alongside a provider class. See
[Mark](mark.md).

### useHighlight

`useHighlight` takes the matching options and returns a Solid accessor that
holds a `HighlightChunk[]`. Pass the options as a function when the query or
text can change. Also takes `exactMatch`: whole words only.

```tsx
import { useHighlight } from '@leverui/components';

const chunks = useHighlight(() => ({
  text: title(),
  query: search(),
  ignoreCase: true,
  exactMatch: true,
}));

// Read chunks() inside tracked Solid JSX.
```

For a squiggle or other custom markup, render the chunks yourself. Wrap only
the chunks that have `match: true`.

## Props

| Prop         | Default  | Type                          | Description                                  |
| ------------ | -------- | ----------------------------- | -------------------------------------------- |
| `query`      | Required | `string \| string[]`          | Word or phrase to highlight, or an array.    |
| `children`   | Required | `string`                      | Text to search and highlight.                |
| `markClass`  | —        | `string`                      | CSS class added to each matched `Mark`.      |
| `markStyle`  | —        | `JSX.CSSProperties \| string` | Native style applied to each matched `Mark`. |
| `ignoreCase` | —        | `boolean`                     | Match upper and lower case alike.            |
| `matchAll`   | —        | `boolean`                     | Mark every match, or only the first.         |
