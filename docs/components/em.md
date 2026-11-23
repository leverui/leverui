# Em

Emphasizes a word or phrase in a sentence, usually in italics.

```tsx
import { Em } from '@leverui/components';
```

```tsx
<Text>
  We are open <Em>every day</Em> except public holidays
</Text>
```

## Guides

### Semantics

Renders a native `em` element, which tells browsers and screen readers the text
is emphasized. With `as` or `asChild`, the element you render carries its own
meaning instead.

Accepts native attributes, refs, `class`, and `style`. `as` changes the HTML
tag. `asChild={(getProps) => <a {...getProps()} />}` renders your own element.

## Customize with CSS

Import `@leverui/components/styles.css` once, before your own CSS. The italic
style works in server-rendered HTML with no scripts. No CSS objects, general
style props, or custom recipes.

Target `.lui-em`. The default sits in a CSS layer, so ordinary CSS
overrides it.

```css
.lui-em {
  font-style: normal;
}
```

`unstyled` turns off the Lever UI style but keeps the `em` element and its
meaning. The browser still shows a native `<em>` in italics. For text that is
not emphasized, use a different HTML tag.
