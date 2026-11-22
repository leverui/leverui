# Lever UI website

This private Solid 2 package builds the public static website with
`@solidjs/vite-plugin` in SSR start mode, `@solidjs/router` and `@solidjs/meta`.
It uses the workspace's `@leverui/components` package and imports its default
stylesheet. The site is independent of the local reference projects.

## Work locally

From the repository root:

```sh
pnpm install
pnpm -C website dev
```

Open `http://127.0.0.1:4173/`. The Storybook workspace remains available on
its own port for detailed component examples.

## Verify and build

```sh
pnpm -C website typecheck
pnpm exec eslint website/src website/vite.config.ts
pnpm -C website build
```

The static build writes deployable files to `website/dist/client/`. `vite build`
produces the client assets and a server bundle in `website/dist/server/`; then
`scripts/prerender.mjs` requests every route through that server bundle and
writes each page's `index.html` into `dist/client/`. It prerenders the homepage,
showcase, playground, documentation landing page, guides index, the overview
guides, every concept page, every maintained component guide in
`docs/components/`, and every theme-variable page. Any route that does not
render with status 200, or logs an error while rendering, fails the build. The
route list lives in `vite.config.ts`. The Markdown source remains in one place;
the website loads it at build time. `dist/server/` is only needed for
prerendering and `vite preview`; deploy `dist/client/`.

The website is not published or deployed by these commands. See
[`docs/website.md`](../docs/website.md) for the site's goals and roadmap.
