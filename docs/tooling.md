# Development tooling

The package uses TypeScript for source and declarations, ESLint for code
quality, and Prettier for formatting. Run these commands from the repository
root:

| Command                         | Check                                                      |
| ------------------------------- | ---------------------------------------------------------- |
| `pnpm typecheck`                | Bounded TypeScript 6 checks for source, stories, and tests |
| `pnpm lint`                     | TypeScript, Solid, JSDoc, and 200-line rules               |
| `pnpm format:check`             | Prettier formatting for maintained files                   |
| `pnpm test`                     | Current component and system tests                         |
| `pnpm test:tooling`             | Guide props tables, theme reference, and package policies  |
| `pnpm storybook`                | Solid component workshop in a browser                      |
| `pnpm test:browser`             | Playwright smoke and future component specs                |
| `pnpm build:storybook`          | Static Storybook build                                     |
| `pnpm generate:theme-reference` | Regenerate CSS variable pages from authored CSS            |
| `pnpm build`                    | Bundles, declarations, default CSS, package smoke test     |

GitHub Actions runs the build, tests, lint, typecheck, formatting check, and
packed consumer check as parallel jobs on every pull request and push to
`main`. Typecheck is the slowest. The packed consumer check installs the
packed archive into a separate app and renders it in Chromium. The release
bundle check runs before a release instead; see [Releasing](releasing.md). The
workflow is `.github/workflows/ci.yml`.

`pnpm format` applies Prettier. `pnpm lint:fix` applies only safe ESLint fixes;
review the diff afterward.

The project tracks `pnpm-lock.yaml` for reproducible installs. The 200-line
rule applies to authored files, not package-manager output. Direct dependencies
in `package.json` use exact versions; the `solid-js` peer range states consumer
compatibility. Run the checks above after dependency updates and before a
release.

`pnpm build` bundles the current source, checks emitted declarations, and
verifies the package. Run `pnpm generate:theme-reference` after changing
authored token or mode CSS. The theme-reference check rejects drift.

`pnpm test` ends with `pnpm test:tooling`. It fails when a component guide's
props table lists a prop that the component does not accept, so a renamed or
removed prop must be updated in its guide in the same change.

`pnpm build` also bundles `src/styles/*.css` into `dist/styles.css` and strips
its whitespace and comments. Values stay as authored, so a variable reads back
the same string. The bundler rejects a width query that is not one of the five
pixel breakpoints. Import `@leverui/components/styles.css` before an
application's theme CSS. Components read those static rules directly from the
stylesheet.

The repository uses the JavaScript TypeScript 6 compiler for type checks and
declarations. `pnpm typecheck` first builds fresh declarations, then checks
remaining source files, stories, browser and server tests, and configuration
in batches. Those batches run several at a time: one worker per CPU and per
3 GiB of memory. Set `LEVERUI_TYPECHECK_JOBS` to choose the number. The
declaration build checks emitted public barrels and records passed batches in
a validated workspace. The root
configuration enables `exactOptionalPropertyTypes` and
`noUncheckedIndexedAccess` for every check, so the library stays valid for
applications, such as the website, that turn them on. After a failure,
rerun the builder with its printed `--resume` path. A memory-limited batch
splits into smaller checks. Project checks run 64 roots per process under a
2 GiB heap cap, and a 3 GiB cap only for an individual file that needs it.
Declaration checks run 64 modules per process. Each process loads the shared
type graph first, so larger batches are faster. This avoids the full-project
native TypeScript 7 process that exceeded 3 GiB.

Keep these rules enforced as components and examples evolve. A passing build
or format check does not count as passing lint.
