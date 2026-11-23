# Code Block

Shows several lines of code, with optional syntax highlighting, a title, and a
copy button.

```tsx
import { CodeBlock } from '@leverui/components';
```

```tsx
<CodeBlock.AdapterProvider>
  <CodeBlock.Root>
    <CodeBlock.Header>
      <CodeBlock.Title />
      <CodeBlock.Control>
        <CodeBlock.CopyTrigger />
        <CodeBlock.CollapseTrigger />
      </CodeBlock.Control>
    </CodeBlock.Header>
    <CodeBlock.Content>
      <CodeBlock.Code>
        <CodeBlock.CodeText />
      </CodeBlock.Code>
    </CodeBlock.Content>
  </CodeBlock.Root>
</CodeBlock.AdapterProvider>
```

## Adapters

Highlights with [Shiki](https://shiki.style/) or
[Highlight.js](https://highlightjs.org/).

> These docs use **Shiki** unless noted.

- Set up an adapter (**Shiki** or **Highlight.js**).
- Pass it to `CodeBlock.AdapterProvider` at the top level.
- Render `CodeBlock.Root` inside `CodeBlock.AdapterProvider`.

### Shiki

```bash
pnpm add shiki
```

Loads the highlighter on demand, with the languages you list.

```tsx
import type { HighlighterGeneric } from 'shiki';
import { createShikiAdapter } from '@leverui/components';

const shikiAdapter = createShikiAdapter<HighlighterGeneric<any, any>>({
  async load() {
    const { createHighlighter } = await import('shiki');
    return createHighlighter({
      langs: ['tsx', 'json'],
      themes: ['github-dark', 'github-light'],
    });
  },
  theme: { dark: 'github-dark', light: 'github-light' },
});

<CodeBlock.AdapterProvider value={shikiAdapter}>{/* ... */}</CodeBlock.AdapterProvider>;
```

### Highlight.js

```bash
pnpm add highlight.js
```

Loads the languages you list on demand.

```tsx
import { createHighlightJsAdapter } from '@leverui/components';
import hljs from 'highlight.js/lib/core';

const highlightJsAdapter = createHighlightJsAdapter<typeof hljs>({
  async load() {
    const languages = {
      tsx: () => import('highlight.js/lib/languages/typescript'),
      html: () => import('highlight.js/lib/languages/xml'),
    };
    await Promise.all(
      Object.entries(languages).map(async ([language, file]) => {
        const { default: languageModule } = await file();
        hljs.registerLanguage(language, languageModule);
      }),
    );
    return hljs;
  },
});
```

## Props

| Prop       | Default  | Type                     | Description                                                       |
| ---------- | -------- | ------------------------ | ----------------------------------------------------------------- |
| `code`     | required | `string`                 | Source code to show.                                              |
| `language` | —        | `string`                 | Language name passed to the adapter.                              |
| `meta`     | —        | `CodeBlockHighlightMeta` | Line numbers, highlighted and focused lines, diffs, color scheme. |
| `size`     | `md`     | `'sm' \| 'md' \| 'lg'`   | Code block size. Responsive.                                      |
| `as`       | `div`    | Native HTML tag          | HTML tag to render.                                               |
| `asChild`  | —        | Solid render function    | Render your own element with the code block's props.              |

All props are reactive. To switch language or tab, change `code` and `language`
on the same root.

## Shared defaults

`CodeBlock.PropsProvider` sets default props for every code block inside it. A
prop on a root wins.

```tsx
<CodeBlock.PropsProvider value={{ size: 'lg' }}>
  <CodeBlock.Root code="const ready = true">...</CodeBlock.Root>
  <CodeBlock.Root size="sm" code="const done = true">
    ...
  </CodeBlock.Root>
</CodeBlock.PropsProvider>
```

`ref` and `asChild` go on each root, not on the provider.

## Customize with CSS

Classes: `.leverui-code-block__root`, plus `__header`, `__title`, `__control`,
`__content`, `__code`, `__codeText`, `__overlay`, and `__footer`.

Set variables on `:root`, a theme wrapper, or one code block.

| Variable                          | Sets                              |
| --------------------------------- | --------------------------------- |
| `--lui-code-block-bg`             | Background.                       |
| `--lui-code-block-fg`             | Text color.                       |
| `--lui-code-block-radius`         | Corner radius.                    |
| `--lui-code-block-padding`        | Inner spacing.                    |
| `--lui-code-block-max-height`     | Height before the code scrolls.   |
| `--lui-code-block-code-font-size` | Code text size.                   |
| `--lui-code-block-header-height`  | Header and footer height.         |
| `--lui-code-block-highlight-bg`   | Background of a highlighted line. |

```css
.api-sample {
  --lui-code-block-radius: 12px;
  --lui-code-block-max-height: 480px;
}
```

State attributes:

- Root: `data-size`.
- Content: `data-expanded`.
- Code text: `data-has-line-numbers`, `data-word-wrap`, `data-has-focused`.
- Each line: `data-line`, plus `data-highlight`, `data-focused`, or `data-diff`.

`unstyled` on the root turns off the Lever UI styles.
