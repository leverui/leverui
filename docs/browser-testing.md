# Browser testing during implementation

Lever UI uses Storybook specimens and Playwright browser checks alongside
focused unit and server tests. Keep Storybook in this repository and outside
the published package.

## Storybook for development and tests

- Give each component named `.stories.tsx` scenarios
  for its default appearance, variants, sizes, states, responsive behavior,
  and important compositions.
- Keep the public examples in `demos/`: each component's registry is
  `demos/<component>.tsx` and its example components are in `demos/examples/`.
  The website imports them directly, and each `.storybook/<component>-examples.stories.tsx`
  only re-exports them. Keep internal test specimens in `.storybook/`. Mount the Lever UI provider and relevant locale or theme context in
  each specimen. Keep story code small and documented under the project
  standards.
- Use theme, accessibility, viewport, and prop controls where they help inspect
  a real contract. Keep a direct story URL for each reproducible scenario.
- Keep curated examples for manual inspection and internal specimens for
  contract tests. Each scenario should have a stable direct URL. Keep Storybook
  and its dependencies development-only.

## Automated browser checks

Use Playwright with its `webServer` option to start Storybook. Test the
component in Chromium during development, then run Firefox and WebKit for
milestone checks and release validation. Prefer queries by accessible role and
name over implementation selectors.

For each applicable component, cover:

1. Initial rendering, default props, variants, and responsive layout.
2. Pointer and keyboard interaction, tab order, focus movement and return.
3. Controlled and uncontrolled state, reactive prop changes, and emitted
   events.
4. Disabled, invalid, loading, open, and closed states.
5. Accessible names, roles, ARIA state, and an axe scan for common issues.
6. Server-rendered markup followed by browser hydration for components that
   must support SSR; check for mismatch warnings and duplicate styles.

Keep fast pure logic tests in Vitest. Use the browser for DOM behavior, layout,
focus, portals, and hydration that jsdom cannot establish reliably.

## Working loop

Open the relevant story while coding, run its focused Playwright spec, and
inspect the browser result. Before a change is done, run the full browser checks
for the affected stories.

Run `pnpm storybook` for the example gallery or `pnpm storybook:internal` to
inspect contract and regression specimens. `pnpm test:browser` uses internal
stories, while `pnpm test:examples` checks the public gallery. Run
`pnpm build:storybook` to verify the public gallery
or `pnpm build:storybook:internal` to build the test index.
Set `LEVERUI_RELEASE_BROWSERS=1` for the Playwright release run across Chromium,
Firefox, and WebKit.
For focused story-only checks, build Storybook once and serve its static assets:

```sh
LEVERUI_STORYBOOK_INTERNAL=1 NODE_OPTIONS=--max-old-space-size=1536 pnpm exec storybook build --output-dir .tmp/storybook-static
LEVERUI_STORYBOOK_STATIC=1 LEVERUI_STORYBOOK_SKIP_BUILD=1 LEVERUI_STORYBOOK_SKIP_HYDRATION_PREP=1 pnpm exec playwright test tests/browser/icon.spec.ts
```

Hydration checks import local TSX modules at runtime and require the Storybook
development server. The default full suite uses that server. For a bounded
release run, split specs by those imports: run story-only specs on the static
build and the remaining specs on the dev server, then verify their test totals
sum to the full suite. Run browser projects sequentially with
`--project=chromium`, `--project=firefox`, and `--project=webkit` when memory is
constrained.
Install Chromium once with `pnpm exec playwright install chromium`. Install
Firefox and WebKit with `pnpm exec playwright install firefox webkit` before a
release run. Add focused component specs as each family is implemented.
WebKit native radio inputs follow DOM order under `dir="rtl"` (Right Arrow moves
forward); Chromium and Firefox use Left Arrow. Segment Group tests check each
engine's native arrow route.
