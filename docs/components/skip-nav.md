# Skip Nav

A link, hidden until focused, that lets keyboard users jump past the navigation
to the main content.

[WebAIM.org on WCAG 2.4.1 (Bypass Blocks - Level A)](https://webaim.org/standards/wcag/checklist#sc2.4.1)
strongly recommends a skip link past content that repeats on many pages.

> Headings and the `main` region let screen reader users skip content. That is
> not enough for sighted keyboard users.

```tsx
import { SkipNavContent, SkipNavLink } from '@leverui/components';
```

```tsx
<SkipNavLink>Skip to content</SkipNavLink>
<SkipNavContent />
```

## In Action

1. Select **Preview** on the Basic Usage example.
2. Press `Tab` twice. The link appears in the upper left of the window.
3. Press `Enter` to move focus to the main content panel.

## Guides

`SkipNavContent` marks where `SkipNavLink` jumps to. The link is hidden until
it has focus. Finish the [stylesheet setup](../getting-started.md) first.

Both parts use `leverui-skip-nav` as the target id by default. For another
target, give **both** parts the same `id`. On `SkipNavLink`, `id` sets the
fragment in the `href`. `SkipNavContent` has `tabIndex={-1}`: code can focus it,
`Tab` skips it. Keep the link near the start of the document. Give the target
the right meaning for the page, for example with `as="main"`.

In your own layout, check that keyboard focus reaches the target after someone
follows the link.

In a Solid Router app, set `rel="external"` on `SkipNavLink`. Otherwise the
router handles the hash link and the browser does not move focus.

## Customize with CSS

`.leverui-skip-nav` styles the link and `.leverui-skip-nav-content` its target.
`--lui-colors-bg-panel` sets the background of the focused link. `unstyled`
on the link turns off its default styles.

For one-off changes, use `class` or `style`. Neither part supports object CSS,
general style props, or custom recipes.
