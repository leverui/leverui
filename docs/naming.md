# Lever UI naming

Use the full product identity throughout the package. Never use the standalone
word `lever` or `Lever` anywhere in code, including identifiers, string
literals, comments, tests, examples, scripts, styles, generated files, and
public APIs. The full spellings below are the only product names to use.

| Context                                                   | Use        |
| --------------------------------------------------------- | ---------- |
| Prose and visible product name                            | `Lever UI` |
| JavaScript and TypeScript identifiers, runtime namespaces | `leverui`  |
| PascalCase identifiers and component names                | `LeverUI`  |
| npm and GitHub organizations                              | `leverui`  |
| Repository and asset paths                                | `leverui`  |
| CSS layer names and storage keys                          | `leverui`  |
| CSS variables, classes, and data attributes               | `lui`      |

Use the short `lui` prefix for every CSS variable, class, and data attribute.
Layer names and storage keys keep `leverui`.

For example, use `--lui-colors-bg`, `.lui-button`, `data-lui-color-mode`,
`leverui.recipes`, and `@leverui/components`. Do not shorten any of these to
the standalone word. This rule applies to private implementation details
as well as exported names and text emitted by code. Prose may use `Lever UI`
but never the shortened product name.

When renaming an existing symbol, update every consumer and assertion. Verify
the built declarations, CSS, and server-rendered HTML so the shipped package
uses the same name as its source.

Demos use `Lever UI` in visible labels and text. No example may use the
shortened product name.
