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
| CSS variables, classes, and data attributes               | `leverui`  |

Use `leverui` for every CSS hook. Public variables use the `--leverui-*`
prefix.

For example, use `--leverui-colors-bg`, `.leverui-button`,
`data-leverui-color-mode`, and `@leverui/components`. Do not shorten any of these
to the standalone word. This rule applies to private implementation details
as well as exported names and text emitted by code. Prose may use `Lever UI`
but never the shortened product name.

When renaming an existing symbol, update every consumer and assertion. Verify
the built declarations, CSS, and server-rendered HTML so the shipped package
uses the same name as its source.

Demos use `Lever UI` in visible labels and text. No example may use the
shortened product name.
